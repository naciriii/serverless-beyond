const dynamoose = require('dynamoose')

dynamoose.AWS.config.update({
  accessKeyId: 'XXXXXXXXXXXXXXX',
  secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  region: 'us-east-1'
})

module.exports = dynamoose
