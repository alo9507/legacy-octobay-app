require('dotenv').config({ path: './.env' })
const readline = require('readline')
const sh = require('shelljs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

if (!process.env.GITHUB_CLIENT_ID) {
  rl.question('GitHub Client ID? ', githubClientId => {
    sh.sed('-i', /^GITHUB_CLIENT_ID=.*$/, 'GITHUB_CLIENT_ID=' + githubClientId, './.env')
    rl.close()
  })
} else {
  rl.close()
}
