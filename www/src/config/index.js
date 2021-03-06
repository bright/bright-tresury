import configCommon from './common.json'

const env = process.env.REACT_APP_DEPLOY_ENV || 'development'

// Using `require` as `import` does not support dynamic loading (yet).
const configEnv = require(`./${env}.json`)

export default { ...configCommon, ...configEnv }
