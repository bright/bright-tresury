## Local development

### Dependencies:

-   Install [nvm](https://github.com/nvm-sh/nvm#install--update-script)
-   Install and use current npm and node: `nvm install v14.16.1; nvm use`  
    (please check [.nvmrc](../.nvmrc) for the currently used node version and if need update this README)
-   Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable): `npm install --global yarn`

In the project directory, please run:

##### `yarn install`

##### `yarn start`

Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### Tests

In the project directory, please run:

##### `yarn test`

If you want to write a test, please create a file with `.test.ts` suffix.

#### Translation

Please do not use plain texts directly in React components.
Please use `common.json` file for translations.

## Storybook

Run `npm run storybook`
Visit [http://localhost:6006](http://localhost:6006)
