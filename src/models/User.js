const dynamoose = require('dynamoose')
const uuid = require('uuid/v4')
const tableName = process.env.STAGE + '_users'

const User = dynamoose.model(tableName, {
  id: {
    type: String,
    default: uuid
  },
  data: Object,
  index_example: {
    type: String,
    index: {
      global: true,
      name: 'ExampleIndexName',
      project: true
    }
  },
  type: String

}, { timestamps: true, update: true })

module.exports = User
