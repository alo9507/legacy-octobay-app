export default ({ app, store }, inject) => {
  const githubEndpoint = 'https://api.github.com/graphql'

  // https://github.com/github/feedback/discussions/3622
  const githubEndpointCorsProxy = process.env.API_URL + '/github/corsproxy'

  const subgraphEndpoint =
    'https://api.thegraph.com/subgraphs/name/octobay/octobay-dev'

  const githubUserProps = `
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
  `
  const pullRequestProps = `
    id
    url
    number
    author {
      ... on User {
        login
        url
        createdAt
        followers {
          totalCount
        }
      }
    }
    title
    state
    merged
    mergedAt
    createdAt
    changedFiles
    autoMergeRequest {
      mergeMethod
    }
    reviews {
      totalCount
    }
    commits {
      totalCount
    }
    comments {
      totalCount
    }
    repository {
      owner {
        login
      }
      createdAt
      forkCount
      viewerCanAdminister
      stargazers {
        totalCount
      }
    }
  `

  const issueProps = `
    id
    title
    url
    number
    closed
    createdAt
    comments {
      totalCount
    }
    labels(first: 100) {
      edges {
        node {
          name
          color
        }
      }
    }
    repository {
      name
      primaryLanguage {
        name
        color
      }
      owner {
        login
      }
    }
    author {
      ... on User {
        login
        url
        email
      }
    }
  `

  const githubAuthHeader = (accessToken) => {
    return {
      headers: {
        Authorization: 'bearer ' + accessToken,
        // 'GraphQL-Features': 'discussions_api',
      },
    }
  }

  const github = {
    getUserById(githubUserId) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($githubUserId:ID!) {
              node(id: $githubUserId) {
                ... on User {
                  ${githubUserProps}
                }
              }
            }`,
            variables: {
              githubUserId,
            },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.node : null))
    },
    getUserByUsername(username) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($username:String!) {
              user(login: $username) {
                ${githubUserProps}
              }
            }`,
            variables: {
              username,
            },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.user : null))
    },
    getIssueById(issueId) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($issueId: ID!) {
              node(id: $issueId) {
                ... on Issue {
                  ${issueProps}
                }
              }
            }`,
            variables: { issueId },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.node : null))
    },
    getIssueByOwnerRepoNumber(owner, repo, number) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($owner: String!, $repo: String!, $number: Int!) {
              repository(owner: $owner, name: $repo) {
                issue(number: $number) {
                  ${issueProps}
                }
              }
            }`,
            variables: { owner, repo, number },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) =>
          response.data ? response.data.repository.issue : null
        )
    },
    getPullRequestById(prId) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($prId: ID!) {
              node(id: $prId) {
                ... on PullRequest {
                  ${pullRequestProps}
                }
              }
            }`,
            variables: { prId },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.node : null))
    },
    getPullRequestByOwnerRepoNumber(owner, repo, number) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($owner: String!, $repo: String!, $number: Int!) {
              repository(owner: $owner, name:$repo) {
                pullRequest(number: $number) {
                  ${pullRequestProps}
                }
              }
            }`,
            variables: { owner, repo, number },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.repository : null))
    },
    getRepository(owner, repo) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($owner: String!, $repo: String!) {
              repository(owner: $owner, name:$repo) {
                id
                name
                url
                homepageUrl
                createdAt
                description
                collaborators {
                  totalCount
                }
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                  color
                }
                owner {
                  login
                  url
                }
              }
            }`,
            variables: { owner, repo },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.repository : null))
    },
    getDiscussionById(discussionId) {
      return app.$axios
        .$post(
          githubEndpointCorsProxy,
          {
            query: `query($discussionId: ID!) {
              node(id: $discussionId) {
                ... on Discussion {
                  id
                  title
                  url
                }
              }
            }`,
            variables: { discussionId },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.node : null))
    },
    getDiscussionByOwnerRepoNumber(owner, repo, number) {
      return app.$axios
        .$post(
          githubEndpointCorsProxy,
          {
            query: `query($owner: String!, $repo: String!, $number: Int!) {
              repository(owner: $owner, name:$repo) {
                discussion(number: $number) {
                  id
                  title
                  url
                  createdAt
                  repository {
                    id
                    owner {
                      id
                    }
                  }
                }
              }
            }`,
            variables: { owner, repo, number },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) =>
          response.data ? response.data.repository.discussion : null
        )
    },
    getProjectById(id) {
      // TODO: implement this
      return new Promise((resolve) => {
        resolve({
          id: '123',
        })
      })
    },
    getOrganizationByName(name) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($name:String!) {
              organization(login: $name) {
                id
                name
                url
                avatarUrl
                websiteUrl
                createdAt
                description
                twitterUsername
                membersWithRole {
                  totalCount
                }
                repositories {
                  totalCount
                }
              }
            }`,
            variables: { name },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => (response.data ? response.data.organization : null))
    },
    isRepoAdmin(owner, repo, username) {
      return app.$axios
        .$post(
          githubEndpoint,
          {
            query: `query($owner: String!, $repo: String!, $username: String!) {
              repository(owner: $owner, name: $repo) {
                collaborators(query: $username) {
                  edges {
                    permission
                  }
                  nodes {
                    login
                  }
                }
              }
            }`,
            variables: { owner, repo, username },
          },
          githubAuthHeader(store.state.githubAccessToken)
        )
        .then((response) => {
          return (
            !!response.data.repository &&
            response.data.repository.collaborators.edges[0].permission.toLowerCase() ===
              'admin'
          )
        })
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
            issues(first: 100) {
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
            oracles(first: 100) {
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
