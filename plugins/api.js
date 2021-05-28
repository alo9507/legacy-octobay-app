export default ({ app, store }, inject) => {
  const githubEndpoint = 'https://api.github.com/graphql'
  const graphEndpoint =
    'https://api.thegraph.com/subgraphs/name/octobay/octobay-dev'

  const api = {
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
    getUserAddress(ethAddress) {
      return app.$axios
        .$post(graphEndpoint, {
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
  }

  inject('api', api)
}
