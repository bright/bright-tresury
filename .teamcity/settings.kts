import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_2.projectFeatures.VersionedSettings
import jetbrains.buildServer.configs.kotlin.v2018_2.projectFeatures.versionedSettings
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.add

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2018.2"

fun Project.buildTypesCounter(): String {
    return "${buildTypes.size + 1}."
}

fun Requirements.dockerAndDockerComposeExist() {
    exists("docker.version")
    exists("dockerCompose.version")
}

fun Requirements.backendAgent() {
    contains("system.agent.name", "backend")
}

fun Project.deployToEnvironment(build: BuildType, environmentName: String): BuildType {
    return buildType {
        id("Deploy$environmentName")
        name = "${this@deployToEnvironment.buildTypesCounter()} Deploy to $environmentName"
        type = BuildTypeSettings.Type.DEPLOYMENT
        buildNumberPattern = "%dep.${build.id}.build.counter% - %build.vcs.number%"
        vcs {
            root(DslContext.settingsRoot)
        }

        dependencies {
            if (build.artifactRules.isNotEmpty()) {
                artifacts(build) {
                    artifactRules = build.artifactRules
                    cleanDestination = true
                }
            }
            snapshot(build) {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
        }

        params {
            text("env.DEPLOY_ENV", environmentName)
        }

        steps {
            script {
                scriptContent = "./scripts/deploy.sh"
            }
        }

        requirements {
            dockerAndDockerComposeExist()
            backendAgent()
        }
    }
}

project {
    params {
        text("env.DOCKER_REGISTRY", "339594496974.dkr.ecr.eu-central-1.amazonaws.com")
        text("env.AWS_ACCESS_KEY_ID", "AKIAU6ELIZPHBL5IPBB7")
        password("env.AWS_SECRET_ACCESS_KEY", "credentialsJSON:f329b27b-1b5d-4462-a119-cdda59b8550c", display = ParameterDisplay.HIDDEN)
    }

    val build = buildType {
        id("Build")
        name = "${this@project.buildTypesCounter()} Build"
        description = "Builds and tests"

        buildNumberPattern = "%build.counter% - %build.vcs.number%"

        vcs {
            root(DslContext.settingsRoot)
        }

        triggers {
            vcs {
                perCheckinTriggering = true
                groupCheckinsByCommitter = true
                enableQueueOptimization = false
            }
        }
        params {
            text("env.BUILD_COUNTER", "%build.counter%")
        }

        steps {
            script {
                scriptContent = "./scripts/build.sh"
            }
        }

        features {
            commitStatusPublisher {
                publisher = upsource {
                    serverUrl = "https://review.brightinventions.pl:443"
                    projectId = "bright-backend-pack"
                    userName = "piotr"
                    password = "credentialsJSON:0f753a37-9cd8-4498-977d-dd00e65b6a61"
                }
            }
        }

        requirements {
            dockerAndDockerComposeExist()
            backendAgent()
        }
    }

    deployToEnvironment(build, "stage").triggers {
        finishBuildTrigger {
            buildType = build.id?.value
            successfulOnly = true
            branchFilter = "+:master"
        }
    }

    deployToEnvironment(build, "prod")
}
