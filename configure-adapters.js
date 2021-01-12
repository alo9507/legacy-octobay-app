require('dotenv').config({ path: './.chainlink/adapters/.env' })
const readline = require('readline')
const sh = require('shelljs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  rl.question('GitHub Personal Access Token? ', personalAccessToken => {
    sh.sed('-i', /^GITHUB_PERSONAL_ACCESS_TOKEN=.*$/, 'GITHUB_PERSONAL_ACCESS_TOKEN=' + personalAccessToken, '.chainlink/adapters/.env')
    rl.close()
  })
} else {
  rl.close()
}
