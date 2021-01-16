# Ethereum based GitHub Economy

## Basic Idea

1. Onboarding GitHub users to Ethereum.
2. Providing a decentralized tool for transfers, bounties, donations and promotions by connecting GitHub with Ethereum and other Social Media and a simplistic user interface.

## Transfers

Transfers in ETH or any ERC20 token can be made to GitHub users, projects and issues and can be released at a certain date and in user defined rates. Recipients can decide what currency they want when withdrawing funds.

### Bounties

Funds sent to issues must be released by the maintainer to a GitHub account of choice. Funds sent to repositories can only be used as issue bounties.

## Onboarding

Any GitHub user, issue or repository can receive ETH/ERC20 payments, without knowing about this service or having an Ethereum account. The involved users will be notified on GitHub and also Twitter and via email, if provided in their GitHub profile. When they register to withdraw the funds, there is no need to prefund a newly created Ethereum account. Deposits can be withdrawn with no gas fees and the GitHub user can immediately start using the service and act in the Ethereum network.

## Promotion

One of the key aspects of the service is the bounty and promotion system. The custom ERC20 token of the service is minted through merged pull requests. That way only contributors can mint the token while on the other side they can be spend (burned) to promote issues, projects or developers on social media.

### Twitter

The custom token can be used to promote issues, projects and developers on Twitter. Any of these can be promoted by any user but only at a certain rate, e.g. once per day. Hashtags are used as subcategories, e.g. #octobay-jobs or #octobay-issue-javascript.

### Leaderboard

The leaderboard keeps track of who minted how many tokens by submitting their merged pull requests, indicating the activity of contributors.

### Newsletter

- Automated Weekly Issue Updates
- Monthly Project & Developer Updates

### Deeplinks

For convenience the following deeplinks are available to prefill the send form:

```
/u/<username>
/u/<username>/<amount>

/i/<username>/<repository>/<issue>
/i/<username>/<repository>/<issue>/<amount>

/r/<username>/<repository>
/r/<username>/<repository>/<amount>
```


## Oracles

The service uses Chainlink nodes as oracles, that run custom external adapters, to check data from GitHub and also to send notifications via email, Twitter or GitHub.

Oracles will also be the main form of project funding. Actions that don't require oracles, won't cost more than the Etherem gas fee. While Ethereum gas costs will be the only user-facing fees, oracles will still be payed in LINK via internal swaps.

### Notifications

Notifications are basically Chainlink oracle jobs. There is a Twitter comment job, a GitHub comment job and an email job. The node must whitelist client contracts to allow them to use the node to send messages.

## Gas Station Network

The Gas Station Network is used to facilitate the meta transactions needed for the seamless onboarding process. OctoBay runs its own relaý station, with the rest of the network as its backup.

## UI Forks

The UI is meant to get forked and deployed as a GitHub page or elsewhere, including an own API server to backup the system or to be adjusted and built upon.

## Current Status

There is an early prototype comprising GitHub user registration, ETH transfers to GitHub users, issue deposits/withdrawals, claiming tokens for merged pull requests and spending them to pin issues and a simple UI, providing access to those features. Basic Chainlink integration is finished but further additions/improvements will come.
