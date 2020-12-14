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
