const sh = require('shelljs')
const oracle = require('./.evm/build/contracts/Oracle.json')
const oracleAddress = oracle.networks[Object.keys(oracle.networks)[0]].address

sh.echo('Creating Chainlink Bridges...')

sh.exec('chainlink bridges create ./.chainlink/adapters/bridges/register.json')
sh.exec('chainlink bridges create ./.chainlink/adapters/bridges/release.json')
sh.exec('chainlink bridges create ./.chainlink/adapters/bridges/claim.json')
sh.exec('chainlink bridges create ./.chainlink/adapters/bridges/graphql.json')

sh.echo('Creating Chainlink Jobs...')

// copying spec templates
sh.sed('-i', 'YOUR_ORACLE_CONTRACT_ADDRESS', oracleAddress, './.chainlink/jobs/register.json')
sh.sed('-i', 'YOUR_ORACLE_CONTRACT_ADDRESS', oracleAddress, './.chainlink/jobs/release.json')
sh.sed('-i', 'YOUR_ORACLE_CONTRACT_ADDRESS', oracleAddress, './.chainlink/jobs/claim.json')
sh.sed('-i', 'YOUR_ORACLE_CONTRACT_ADDRESS', oracleAddress, './.chainlink/jobs/graphql/bool.json')
sh.sed('-i', 'YOUR_ORACLE_CONTRACT_ADDRESS', oracleAddress, './.chainlink/jobs/graphql/bytes32.json')
sh.sed('-i', 'YOUR_ORACLE_CONTRACT_ADDRESS', oracleAddress, './.chainlink/jobs/graphql/int256.json')
sh.sed('-i', 'YOUR_ORACLE_CONTRACT_ADDRESS', oracleAddress, './.chainlink/jobs/graphql/uint256.json')

// creating jobs
sh.exec('chainlink jobs create ./.chainlink/jobs/register.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/release.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/claim.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/graphql/bool.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/graphql/bytes32.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/graphql/int256.json')
sh.exec('chainlink jobs create ./.chainlink/jobs/graphql/uint256.json')

// store job ids in filenames
sh.exec('chainlink jobs list', (code, output) => {
  const jobIDs = output.match(/[a-f0-9]{32}/ig)
  sh.sed('-i', /^CHAINLINK_REGISTER_JOB_ID=.*$/, 'CHAINLINK_REGISTER_JOB_ID=' + jobIDs[0], '.evm/.env')
  sh.sed('-i', /^CHAINLINK_RELEASE_JOB_ID=.*$/, 'CHAINLINK_RELEASE_JOB_ID=' + jobIDs[1], '.evm/.env')
  sh.sed('-i', /^CHAINLINK_CLAIM_JOB_ID=.*$/, 'CHAINLINK_CLAIM_JOB_ID=' + jobIDs[2], '.evm/.env')
})
