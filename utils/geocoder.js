const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter:'https',
  apiKey: 'VRuTBhQvG7ROVSN4dgCF7jS9Rl7ixdBo',
  formatter: null
};
const geocoder = NodeGeocoder(options)
module.exports = geocoder