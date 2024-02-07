# SmartPass Angular Node Take-home
Thank you for taking the time to go through this exercise. This project is composed of two main components: a backend [Express](https://expressjs.com/) server, and an [Angular](https://angular.io/) single page client application. At SmartPass we use Angular with some React in our client, and [Go](https://go.dev/) for our backend.

The purpose of this assessment is to get a feel of your coding style, judgement for refactoring (interface design/componentization), and ability to debug. Please read the full description, and expectation before diving in. If you run into any issues please reach out immediately after verifying you have the proper versions of the dependencies!

Your task consists of a few requirements:
- TODO: Fix a bug where \<something is wrong with the frontend\>
- TODO: Fix a bug where \<something is wrong with the backend\>
- TODO: Implement a feature for \<TBD\>
We know that the project has strange decisions and trade-offs, please be sure to make any changes that you think improves the quality and maintainability of the code (or point out the changes that you'd make) as you go through the tasks.

---

## Development Requirements
- The node version defined in [./.nvmrc]. The installation instructions can be found at [https://nodejs.org/en/download/].
  Feel free to use any node versioning or download tool. At SmartPass we use [nvm](https://github.com/nvm-sh/nvm).
- The yarn version defined in [./package.json] `packageManager` key. Installation instructions can be found at [https://yarnpkg.com/getting-started/install].

## Getting Started
This project uses yarn [workspaces](https://yarnpkg.com/features/workspaces) to manage 3 packages: client for the webapp, server for the backend, and common for shared utilities between the webapp and the backend. To install all needed dependencies, run
```sh
yarn install
```

Once the dependencies are installed, run
```sh
yarn start
```
this will start the client and server in dev mode. We expect that the development environment has ports `3000`, and `4200` available to bind. In dev mode, both components support live reloading. Additionally, each component can be started individually using `yarn start:server` or `yarn start:client`.
