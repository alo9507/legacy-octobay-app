# OctoBay

## Run a fork

If you want to run your own instance of OctoBay you need to...

- fork the repository and enable the GitHub page in the settings.
- create a GitHub OAuth app.
- run this [API server](https://github.com/octobay/api).
- edit .env file.
- build and deploy the app.

Start with [forking this repository](https://github.com/octobay/app/fork) and enable the GitHub page for the `gh-pages` branch.

![image](https://user-images.githubusercontent.com/6792578/104727439-9df69c00-5735-11eb-8bc0-b7b6b84f5ca8.png)

Now you should already have a running app at `https://<your username>.github.io/app`. You can rename your fork repository to whatever you want but then you need to adjust `router.base` in your `nuxt.config.js`.

Now clone your fork locally and make some adjustments.

```shell
git clone https://github.com/<your username>/app octobay-app && cd octobay-app && yarn
```

You **must** adjust the following parameters in your `.env` file.

| Key | Default | Description |
| - | - | -  |
| `API_URL` | `https://octobay.uber.space` | The URL of your API server. |
| `GITHUB_CLIENT_ID` | `3462fb03655aa9c60846` | Your GitHub OAuth app client ID. |

If you don't change these, users will be redirected to the main instance of OctoBay after connecting their GitHub account.

You **can** adjust the following parameters in your `.env` file:

| Key | Default | Description |
| - | - | -  |
| `UI_NAME` | `OctoBay` | A name for your fork. |
| `UI_SHOW_FORKS` | `OctoBay` | Show the fork selection at the bottom. |
| `UI_COLOR` | `OctoBay` | The main color of your fork. (background, buttons, etc.) |
| `UI_REPOSITORY_WHITELIST` | `OctoBay` | Support only certain repositories. You can add a list of usernames/organizations or specific repositories. `ethereum,octobay/contracts` |
| `UI_DEFAULT_ORACLE` | `random` | Set a default oracle you want to support with your UI.

After you made your adjustments, run `yarn app:generate` to generate a static site build and then `yarn app:deploy` to push it to your remote `gh-pages` branch to update your OctoBay instance.

## Local Development Setup

### Prepare

You need Node v12.18, Go 1.14 and an empty postgres database named `chainlink-local` with the default `postgres:postgres` user and port 5432 (or adjust `.env.chainlink.sample`) as well as a GitHub [OAuth app](https://github.com/settings/applications/new) client ID for the web app and a [personal access token](https://github.com/settings/tokens/new) for the chainlink adapters. You will be asked during installation to provide this information.

## Install

Clone the repository and install its dependencies.

```bash
git clone https://github.com/octobay/app octobay-app && cd octobay-app && yarn
```

Now start the local Ethereum node, the Gas Station Network and the Chainlink node and its adapters, all in their own terminal sessions.

```bash
yarn evm
# or: yarn evm 'mnemonic seed phrase'
```

```bash
yarn evm:gsn
```

When running the Chainlink node for the first time, you will be asked to set an email address and a password. You'll need those in the next step.

```bash
yarn chainlink:node
```

When running the adapters for the first time, you will be asked to provide your GitHub personal access token.

```bash
yarn chainlink:adapters
```

## Deploy Contracts

When running for the first time, you will be asked to provide your Chainlink node's address. Open http://localhost:6688/config in your browser (`yarn chainlink:node` must be running), login using your email and password from before, and copy the `ACCOUNT_ADDRESS`. Now you can deploy the contracts. During deployment you will also have to log in to your Chainlink node, so the necessary job specifications can be created for you.

```bash
yarn evm:deploy
```

This will deploy all OctoBay contracts as well as the Chainlink token and an oracle, create jobs for that oracle on the Chainlink node and configure the OctoBay contract accordingly and also make sure all contracts are funded properly.

## Run App

When running the app for the first time you will be asked to provide your GitHub app's client ID.
Run the app and open `http://localhost:3000/octobay` in your browser.

```bash
yarn app
```
