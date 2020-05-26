const dynamoose = require('dynamoose')
module.exports = {

  mockEvent (type, data) {
    let response = {}
    switch (type) {
      case 'http':
        response.context = {
          awsRequestId: 'offline_awsRequestId_ck23e98gq00072gd38e9ngsq9',
          clientContext: {},
          functionName: 'slsBeyond-dev-handlePostSomething',
          functionVersion: 'offline_functionVersion_for_slsBeyond-dev-handlePostSomething',
          identity: {},
          invokedFunctionArn: 'offline_invokedFunctionArn_for_-dev-handlePostSomething',
          logGroupName: 'offline_logGroupName_for_slsBeyond-dev-handlePostsomething',
          logStreamName: 'offline_logStreamName_for_slsBeyond-dev-handlePostsomething'
        }
        response.event = {
          body: JSON.stringify(data),
          pathParameters: {},
          requestContext: {
            accountId: 'offlineContext_accountId',
            apiId: 'offlineContext_apiId',
            authorizer: {
              principalId: 'SomeAuthIdentifier'
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
                  'some_string': {
                    'S': data.some_string
                  },
                  'id': {
                    'S': data.id
                  },
                  'some_number': {
                    'N': data.some_number
                  },
                  'updatedAt': {
                    'N': data.updatedAt
                  }
                },
                'SequenceNumber': '103850400000000051671165287',
                'SizeBytes': 13528,
                'StreamViewType': 'NEW_IMAGE'
              },
              'eventSourceARN': 'arn:aws:dynamodb:us-east-1:111111111111:table/dev_table_name/stream/2019-09-24T15:04:28.282'
            }
          ]
        }
        break
      case 's3':
        response.event = {
          'Records': [
            { 'eventVersion': '2.0',
              'eventSource': 'aws:s3',
              'awsRegion': 'us-east-1',
              'eventTime': '2016-09-25T05:15:44.261Z',
              'eventName': 'ObjectCreated:Put',
              'userIdentity':
              { 'principalId': 'AWS:AROAW5CA2KAGZPAWYRL7K:cli' },
              'requestParameters': { 'sourceIPAddress': '222.24.107.21' },
              'responseElements': { 'x-amz-request-id': '00093EEAA5C7G7F2', 'x-amz-id-2': '9tTklyI/OEj4mco12PgsNksgxAV3KePn7WlNSq2rs+LXD3xFG0tlzgvtH8hClZzI963KYJgVnXw=' },
              's3': { 's3SchemaVersion': '1.0',
                'configurationId': '151dfa64-d57a-4383-85ac-620bce65f269',
                'bucket': { 'name': 'service-1474780369352-1',
                  'ownerIdentity': {
                    'principalId': 'A3QLJ3P3P5QY05'
                  },
                  'arn': 'arn:aws:s3:::service-1474780369352-1'
                },
                'object': {
                  'key': data.id,
                  'size': 11,
                  'eTag': '5eb63bbbe01eetd093cb22bb8f5acdc3',
                  'sequencer': '0057E75D80IA35C3E0'
                }
              }
            }
          ]
        }

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
