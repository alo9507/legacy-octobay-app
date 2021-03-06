export default function ({ store }) {
  const prefills = location.hash.replace('#', '').split('/').filter(Boolean)
  if (prefills.length > 1) {
    store.commit('setView', 'send')

    let type, username, repository, issue, amount, token

    if (prefills[0] === 'u') {
      type = 'send-user'
      username = prefills[1]
      amount = Number(prefills[2])
    } else if (prefills[0] === 'r') {
      type = 'send-repository'
      username = prefills[1]
      repository = prefills[2]
      amount = Number(prefills[3])
    } else if (prefills[0] === 'i') {
      type = 'send-issue'
      username = prefills[1]
      repository = prefills[2]
      issue = prefills[3]
      amount = Number(prefills[4])
    }

    store.commit('setRedirectPrefills', {
      type,
      username,
      repository,
      issue,
      amount,
      token,
    })
  }
}
