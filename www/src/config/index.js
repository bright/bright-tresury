import configCommon from './common.json'
import stage from './stage.json'
import qa from './qa.json'
import prod from './prod.json'
import test from './test.json'
import development from './development.json'

const env = process.env.REACT_APP_DEPLOY_ENV || 'development'
const configs = {
    stage: stage,
    prod: prod,
    qa: qa,
    test: test,
    development: development,
}
// Using `require` as `import` does not support dynamic loading (yet).
const configEnv = configs[env]

const config = { ...configCommon, ...configEnv, env }

export default config
