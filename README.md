# OctoBay

## Local Development Setup

### Prepare

You need Node v12.18, Go 1.14 and an empty postgres database named `chainlink-local` with the default `postgres:postgres` user and port 5432 (or adjust `.env.chainlink.sample`) as well as a GitHub [OAuth app](https://github.com/settings/applications/new) client ID for the web app and a [personal access token](https://github.com/settings/tokens/new) for the chainlink adapters. You will be asked during installation to provide this information.

## Install

Clone the repository and install its dependencies.

```bash
git clone https://github.com/mktcode/octobay && cd octobay && yarn
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
