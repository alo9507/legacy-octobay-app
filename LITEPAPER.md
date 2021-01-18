# OctoBay - Ethereum and GitHub

## Motivation

OctoBay started out as a playground project to learn Solidity and smart contract development and has since grown into a working prototype for a tool that many developers and project maintainers might find useful. OctoBay wants to provide an easy and intuitive funding and promotion tool for open source projects. While other services are often times too cumbersome and rely on central entities to take care of your funds, OctoBay focuses on simplicity and decentralization to facilitate a seamless and trustworthy user experience.

Since the progress of Ethereum and cryptocurrencies as a whole, relies heavily on the developers working on the technology, one of OctoBay's goals is to get new developers and projects to Ethereum. Therefore it provides different ways of inviting users, without requiring them to fund their new accounts upfront.

## Transfers

Transfers can be made in ETH or any ERC20 token by referencing a GitHub user, project or issue and can be scheduled and split into installments. Users and repositories have an optional savings account, where deposits will earn yield, but are locked up for a minimum period of time. Funds can be withdrawn in ETH or any ERC20 token.

### Bounties

Funds sent to issues are held in the OctoBay contract until the maintainer of the project releases them to a GitHub user of choice. Funded issues are also displayed on the issue pinboard, ordered by deposit size, where they can be pinned to the top of the board or promoted on Twitter using the platforms custom token.

### Onboarding

Any GitHub user, issue or repository can receive ETH/ERC20 payments, without knowing about this service or having an Ethereum account. The involved users (e.g. project owner or issue author) will be notified on GitHub and optionally on Twitter and via email, if this information is available in their GitHub profiles. When they register to withdraw the funds, there is no need to fund a newly created Ethereum account in advance. Using meta transactions and the Gas Station Network, deposits can be withdrawn with no gas fees and the GitHub user can immediately start using the service and act in the Ethereum network.

OctoBay also provides deeplinks (like `/u/<username>/<amount>` or `/r/<username>/<repository>/<amount>`), which projects and users can use to ask for donations via OctoBay, without having to have ETH or even create an Ethereum account before withdrawing their first payments.

#### Gas Station Network

The Gas Station Network is used to facilitate the meta transactions needed for the gasless onboarding of new users. OctoBay runs its own relaý station, with the rest of the network as its backup.

## Twitter & OPIN Token

The platform also uses a custom ERC20 token, called OctoPin (OPIN), to pay for promotional features. It can only be minted by contributing to projects and thus creating merged pull requests. Those pull requests can be submitted on OctoBay to get rated and converted to OctoPin tokens.
The token can be freely traded on Uniswap and using it for promotions will burn it. The rate of minting is bound to the number of followers the @OctoBayApp account has. The more followers, the lower the mintable amount per pull request and the higher the price for promotions will be.

An issue can be promoted on Twitter via a post from the @OctoBayApp account, while the OctoBay contract holds the connection between tweet and issue, for pinning or retweeting it later. Issues can also be pinned on the OctoBay pinboard by burning tokens.

## Contributor Leaderboard

The leaderboard keeps track of who minted how many tokens by submitting their merged pull requests.

## Oracles

OctoBay uses Chainlink oracles, that run custom external adapters to check data from GitHub and also to send notifications/posts via email, Twitter or GitHub.

Oracle jobs will also be the only form of profit-taking. While Ethereum gas costs will be the only user-facing fees, oracles will still be payed in LINK via internal swaps. OctoBay will run its own oracle node alongside a handful of others (~10). Oracles are encouraged to run their own UI instance, where they can set themselves as the default oracle or even the only one. The main OctoBay UI instance will always distribute requests randomly to all oracles and prioritize them in the list of all forks.

### Notifications

Notifications are basically Chainlink oracle jobs. There is a Twitter comment job, a GitHub comment job and an email job. The node must whitelist client contracts (OctoBay) to allow them to use the node to send messages.

### Additional Adapters

The oracles provide a set of general purpose adapters for other projects to use.

- GitHub GraphQL API
- GitHub Comment
- Twitter User/Post Info
- Twitter Tweet/Retweet/Like

Credentials/access tokens might need to be shared to the oracle(s).

## UI Forks

The UI is meant be forked and deployed as a GitHub page or elsewhere, including an own API server to backup the system or to be adjusted and built upon. UI hosts can easily make simple style adjustments, configure oracles or whitelist repositories. The main instance will always show a list of all forks, ordered by the stars the repository has on GitHub, prioritizing those that are run by the oracles.
