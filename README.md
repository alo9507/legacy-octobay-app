# OctoBay

OctoBay is a decentralized bounty and promotion platform for open source projects on GitHub.

- [Demo](https://octobay.github.io/app)
- [Docs](https://octobay.github.io/docs)
- [API](https://github.com/OctoBay/api)
- [Contracts](https://github.com/OctoBay/contracts)
- [Chainlink Adapters](https://github.com/OctoBay/chainlink-adapters)
- [Subgraph](https://github.com/OctoBay/subgraph)

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

After you made your adjustments, run `yarn app:generate` to generate a static site build and then `yarn app:deploy` to push it to your remote `gh-pages` branch to update your OctoBay instance. To test your changes run `yarn app:dev` to start a local server.

## Local Development Setup

See: https://github.com/octobay/install

![mindmap](https://user-images.githubusercontent.com/6792578/105842763-fe5bc800-5fd6-11eb-81b6-0bf30d503067.png)
