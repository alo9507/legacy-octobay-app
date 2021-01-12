require('dotenv').config({ path: './.env' })
const readline = require('readline')
const sh = require('shelljs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

if (!process.env.GITHUB_CLIENT_ID && process.env.CHAINLINK_NODE_ADDRESS) {
  rl.question('GitHub Client ID? ', githubClientId => {
    sh.sed('-i', /^GITHUB_CLIENT_ID=.*$/, 'GITHUB_CLIENT_ID=' + githubClientId, './.env')
    rl.close()
  })
} else if (process.env.GITHUB_CLIENT_ID && !process.env.CHAINLINK_NODE_ADDRESS) {
  rl.question('Chainlink Node Address? ', chainlinkNodeAddress => {
    sh.sed('-i', /^CHAINLINK_NODE_ADDRESS=.*$/, 'CHAINLINK_NODE_ADDRESS=' + chainlinkNodeAddress, './.env')
    rl.close()
  })
} else if (!process.env.GITHUB_CLIENT_ID && !process.env.CHAINLINK_NODE_ADDRESS) {
  rl.question('GitHub Client ID? ', githubClientId => {
    rl.question('Chainlink Node Address? ', chainlinkNodeAddress => {
      sh.sed('-i', /^CHAINLINK_NODE_ADDRESS=.*$/, 'CHAINLINK_NODE_ADDRESS=' + chainlinkNodeAddress, './.env')
      sh.sed('-i', /^GITHUB_CLIENT_ID=.*$/, 'GITHUB_CLIENT_ID=' + githubClientId, './.env')
      rl.close()
    })
  })
} else {
  rl.close()
}
