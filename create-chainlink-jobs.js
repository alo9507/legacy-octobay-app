require('dotenv').config({ path: './evm/.env' })
const sh = require('shelljs')
const oracle = require('./.evm/build/contracts/Oracle.json')
const oracleAddress = oracle.networks[Object.keys(oracle.networks)[0]].address
const timestamp = new Date()

sh.echo('Creating Chainlink jobs:')

sh.echo('Creating bridges...')

sh.exec('chainlink bridges create ./.chainlink/adapters/bridges/register.json')
sh.exec('chainlink bridges create ./.chainlink/adapters/bridges/release.json')
sh.exec('chainlink bridges create ./.chainlink/adapters/bridges/claim.json')

if (process.env.CHAINLINK_REGISTER_JOB_ID) {
  sh.echo('Archiving old jobs...')

  sh.exec('chainlink jobs archive ' + process.env.CHAINLINK_REGISTER_JOB_ID)
  sh.exec('chainlink jobs archive ' + process.env.CHAINLINK_RELEASE_JOB_ID)
  sh.exec('chainlink jobs archive ' + process.env.CHAINLINK_CLAIM_JOB_ID)
}

sh.echo('Creating jobs...')

// replacing names
sh.sed('-i', /\"name\": \".*\"/, `"name": "OctoBay Register ${timestamp}"`, './.chainlink/jobs/register.json')
sh.sed('-i', /\"name\": \".*\"/, `"name": "OctoBay Release ${timestamp}"`, './.chainlink/jobs/release.json')
sh.sed('-i', /\"name\": \".*\"/, `"name": "OctoBay Claim ${timestamp}"`, './.chainlink/jobs/claim.json')

// replacing oracle address
sh.sed('-i', /\"address\": \".*\"/, `"address": "${oracleAddress}"`, './.chainlink/jobs/register.json')
sh.sed('-i', /\"address\": \".*\"/, `"address": "${oracleAddress}"`, './.chainlink/jobs/release.json')
sh.sed('-i', /\"address\": \".*\"/, `"address": "${oracleAddress}"`, './.chainlink/jobs/claim.json')

// creating jobs
sh.exec('chainlink jobs create ./.chainlink/jobs/register.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/release.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/claim.json')

// store job ids in filenames
sh.exec('chainlink jobs list', (code, output) => {
  const jobIDs = output.match(/[a-f0-9]{32}/ig).reverse()
  sh.sed('-i', /^CHAINLINK_CLAIM_JOB_ID=.*$/, 'CHAINLINK_CLAIM_JOB_ID=' + jobIDs[0], '.evm/.env')
  sh.sed('-i', /^CHAINLINK_RELEASE_JOB_ID=.*$/, 'CHAINLINK_RELEASE_JOB_ID=' + jobIDs[1], '.evm/.env')
  sh.sed('-i', /^CHAINLINK_REGISTER_JOB_ID=.*$/, 'CHAINLINK_REGISTER_JOB_ID=' + jobIDs[2], '.evm/.env')
})
