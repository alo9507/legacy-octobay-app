const sh = require('shelljs')

const octoBayAddress = require('./.evm/build/contracts/OctoBay.json').address
const octoPinAddress = require('./.evm/build/contracts/OctoPin.json').address
const linkAddress = require('./.evm/build/contracts/LinkToken.json').address
const paymasterAddress = require('./.evm/build/contracts/OctoBayPaymaster.json').address

// .env
sh.sed('-i', /^OCTOBAY_ADDRESS=.*$/, 'OCTOBAY_ADDRESS=' + octoBayAddress, '.env')
sh.sed('-i', /^OCTOPIN_ADDRESS=.*$/, 'OCTOPIN_ADDRESS=' + octoPinAddress, '.env')
sh.sed('-i', /^GSN_PAYMASTER_ADDRESS=.*$/, 'GSN_PAYMASTER_ADDRESS=' + paymasterAddress, '.env')
sh.sed('-i', /^LINK_CONTRACT_ADDRESS=.*$/, 'LINK_CONTRACT_ADDRESS=' + linkAddress, './.chainlink/node/.env')
