const dynamoose = require('../models/config')
module.exports = {

  mockEvent (type, data) {
    let response = {}
    switch (type) {
      case 'http':
        response.context = {
          awsRequestId: 'offline_awsRequestId_ck23e98gq00072gd38e9ngsq9',
          clientContext: {},
          functionName: 'slsApi-dev-handlePostAppleReceiptVerification',
          functionVersion: 'offline_functionVersion_for_slsApi-dev-handlePostAppleReceiptVerification',
          identity: {},
          invokedFunctionArn: 'offline_invokedFunctionArn_for_slsApi-dev-handlePostAppleReceiptVerification',
          logGroupName: 'offline_logGroupName_for_slsApi-dev-handlePostAppleReceiptVerification',
          logStreamName: 'offline_logStreamName_for_slsApi-dev-handlePostAppleReceiptVerification'
        }
        response.event = {
          body: JSON.stringify(data),
          pathParameters: {},
          requestContext: {
            accountId: 'offlineContext_accountId',
            apiId: 'offlineContext_apiId',
            authorizer: {
              app_id: 'a310f1eb-e60d-4133-b078-e08b953a78cf',
              appId: 'com.8fit.app',
              credentials: '{"password":"0a504edf814345efa8069f1c27017c6f"}',
              principalId: 'a310f1eb-e60d-4133-b078-e08b953a78cf'
            }
          }
        }

        break
      case 'ddbStream':
        response.event = {
          'Records': [
            {
              'eventID': '1ffd4e6e043866fedf0244a0ed2035f7',
              'eventName': 'INSERT',
              'eventVersion': '1.1',
              'eventSource': 'aws:dynamodb',
              'awsRegion': 'us-east-1',
              'dynamodb': {
                'ApproximateCreationDateTime': 1571228067,
                'Keys': {
                  'id': {
                    'S': data.id
                  }
                },
                'NewImage': {
                  'createdAt': {
                    'N': data.updatedAt
                  },
                  'request_context': {
                    'S': data.request_context
                  },
                  'payload': {
                    'S': data.payload
                  },
                  'purchase_id': {
                    'S': data.purchase_id
                  },
                  'id': {
                    'S': data.id
                  },
                  'type': {
                    'S': data.type
                  },
                  'app_id': {
                    'S': data.app_id
                  },
                  'updatedAt': {
                    'N': data.updatedAt
                  }
                },
                'SequenceNumber': '103850400000000051671165287',
                'SizeBytes': 13528,
                'StreamViewType': 'NEW_IMAGE'
              },
              'eventSourceARN': 'arn:aws:dynamodb:us-east-1:104892087807:table/dev_apple_notifications/stream/2019-09-24T15:04:28.282'
            }
          ]
        }

        break
      case 's3':

        break

      default:
        break
    }
    return response
  },
  async clearDb (tbl) {
    return dynamoose.ddb().deleteTable({ TableName: 'test_' + tbl }).promise()
  }
}
