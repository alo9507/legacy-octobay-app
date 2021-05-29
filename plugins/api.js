export default ({ app, store }, inject) => {
  const githubEndpoint = 'https://api.github.com/graphql'
  const subgraphEndpoint =
    'https://api.thegraph.com/subgraphs/name/octobay/octobay-dev'

  const github = {
    getUserById(githubUserId) {
      const accessToken = store.state.githubAccessToken
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($githubUserId:ID!) {
              node(id: $githubUserId) {
                ... on User {
                  id
                  createdAt
                  updatedAt
                  login
                  url
                  avatarUrl
                  location
                  name
                  websiteUrl
                  twitterUsername
                  email
                  hasSponsorsListing
                  isHireable
                }
              }
            }`,
            variables: {
              githubUserId,
            },
          },
          {
            headers: {
              Authorization: 'bearer ' + accessToken,
            },
          }
        )
        .then((response) => (response.data ? response.data.node : null))
    },
  }

  const subgraph = {
    me(accessToken) {
      return app.$axios
        .$get('https://api.github.com/user', {
          headers: {
            Authorization: 'bearer ' + accessToken,
          },
        })
        .then((githubUser) => {
          githubUser.ethAddresses = []
          githubUser.incomingDeposits = []
          return app.$axios
            .$post(subgraphEndpoint, {
              query: `query($githubUserId:String!) {
                user(id: $githubUserId) {
                  addresses {
                    name
                    address
                  }
                  deposits {
                    id
                    from
                    amount
                  }
                }
              }`,
              variables: {
                githubUserId: githubUser.node_id,
              },
            })
            .then((data) => {
              if (data.errors) {
                return null
              } else {
                githubUser.ethAddresses = data.data.user.addresses
                githubUser.incomingDeposits = data.data.user.deposits
                return githubUser
              }
            })
            .catch(() => {
              // return a github user object in any case
              return githubUser
            })
        })
    },
    getUserAddress(ethAddress) {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `query($ethAddress:ID!) {
            userAddress(id: $ethAddress) {
              user {
                id
              }
            }
          }`,
          variables: {
            ethAddress,
          },
        })
        .then((response) => (response.data ? response.data.userAddress : null))
    },
    getOutgoingDepositsByAddress(ethAddress) {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `query($ethAddress:String!) {
            userDeposits(where: { from: $ethAddress }) {
              id
              amount
              user {
                id
              }
            }
          }`,
          variables: {
            ethAddress,
          },
        })
        .then((response) => (response.data ? response.data.userDeposits : []))
    },
    getConfig(octobayAddress) {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `query($octobayAddress:String!) {
            config(id: $octobayAddress) {
              owner
              trustedForwarder
              userAddressStorage
              oracleStorage
              depositStorage
              octobayGovernor
              octobayGovNFT
              ethUSDPriceFeed
            }
          }`,
          variables: {
            octobayAddress,
          },
        })
        .then((response) => (response.data ? response.data.config : {}))
    },
    getIssues() {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `{
            issues(first: 10) {
              id
              status
              deposits {
                id
                amount
                from
              }
            }
          }`,
        })
        .then((response) => (response.data ? response.data.issues : []))
    },
    getIssue(issueId) {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `query($issueId:ID!) {
            issue(id: $issueId) {
              status
              deposits {
                id
                amount
                from
              }
            }
          }`,
          variables: {
            issueId,
          },
        })
        .then((response) => (response.data ? response.data.issue : null))
    },
    getOracles() {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `{
            oracles(first: 10) {
              id
              name
              ethAddress
              jobs {
                id
                name
                fee
              }
            }
          }`,
        })
        .then((response) => (response.data ? response.data.oracles : []))
    },
    getDepartments() {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `{
            governanceDepartments(first: 100) {
              id
              creator
              projectId
              tokenAddress
              name
              symbol
              minQuorum
              requiredSharesToCreateProposals
              holders {
                id
                ethAddress
                balance
              }
              nfts {
                id
                ownerAddress
                permissions
              }
              proposals {
                id
                count
                quorum
                startDate
                endDate
                balanceSnapshotId
                department {
                  tokenAddress
                  projectId
                }
                votes {
                  id
                  holder {
                    id
                    ethAddress
                    balance
                  }
                  percentage
                }
              }
            }
          }`,
        })
        .then((response) =>
          response.data ? response.data.governanceDepartments : []
        )
    },
    getPermissionNFTsByAddress(ownerAddress) {
      return app.$axios
        .$post(subgraphEndpoint, {
          query: `query($ownerAddress:String!) {
            governancePermissionNFTs(where: {ownerAddress: $ownerAddress}) {
              id
              ownerAddress
              permissions
              department {
                id
                projectId
                tokenAddress
                name
                symbol
              }
            }
          }`,
          variables: {
            ownerAddress,
          },
        })
        .then((response) =>
          response.data ? response.data.governancePermissionNFTs : []
        )
    },
  }

  inject('github', github)
  inject('subgraph', subgraph)
}
