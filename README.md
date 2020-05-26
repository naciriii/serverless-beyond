# Serverless Beyond Framework

Serverless Beyond framework is built based on serverless framework in order to simplify development of microservices and automate usual tasks and help you to focus on writing code within a clean and optimized architecture.

## CLI Commands
The Cli command **ngen** will handle the multiple tasks listed below

#### Generate Request
```sh
 ngen request $requestName 
 ```
 Which will create the below for **postUserRequest**
 ```json
 {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "title": "postUserRequest request Schema",
        "required": [
            "simpleField"
        ],
        "properties": {
          "simpleField": {
            "type":"string",
            "title": ""
          },
          "complexField": {
            "type": "object",
            "title": "t",
            "required": [
                "field1","field2"
              ],
            "properties": {
                "field1": {
                    "type": "string",
                    "description": ""
                },
                "field2": {
                    "type": "string",
                    "description": ""
                }
                }
          }  
        }
      }
```

#### Generate controller

```sh
 ngen controller $controllerName
 ngen controller $path_under_controllers/$controllerName
 ```
 Which generate an empty controller like below
 ```javascript
 const controller = require('./Controller')

    module.exports = class UserController extends controller {

    }
```
 Generate controller and initialize lambda handlers and link both

```sh
 ngen controller $controllerName --handler
 ngen controller $controllerName --handler $customHandlerName
 ```
 which create the lambda yml handler under **src/resources/handlers/User.yml** as below 

 ```yml
 handleLambdaTrigger:
  handler: src/handlers/UserHandler.index
  events:
    - http:
        path: ""
        method: ""
        cors: true
        request:
          schema: ""
 ```
And initialize the link between the handler and the controller under **src/handlers/UserHandler.js**

 ```javascript
 const TestController = require('../controllers/UserController')

/**
 */   
module.exports = new UserController()
```

 #### Generate Service
```sh
 ngen service $serviceName
 ```
 #### Generate Model
 To generate a model extending dynamoose basic scaffolding
```sh
 ngen model $modelName
 ```
 You can add table tag to config the Active record Model
 ```sh
 ngen model $modelName --table
 ```
 and possibly you can customize the table name through cli
 ```sh
 ngen model $modelName --table $customTableName
 ```
 Which results in
 ```javascript
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
```

#### Generate Resource
Resource can be **Table**, **LambdaHandler**
```sh
 ngen resource $resourceType $resourceName
 ```
 ###### Generate Table
 As For tables you can use either the initialization with/without index and stream
 ```sh
 ngen resource table users
 ```
 Which will add this table specification
 ```yml
  usersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: ${self:provider.stage}_users
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1
 ```
 **--index** option will add an example index to the table specificaiton
 ```yml
      GlobalSecondaryIndexes:
        - IndexName: indexName
          KeySchema:
            - AttributeName: index_key
              KeyType: HASH
          Projection:
            ProjectionType: ALL
          ProvisionedThroughput:
            ReadCapacityUnits: 1
            WriteCapacityUnits: 1
 ```
 As for **--stream** option will add Stream specification
  ```sh
 ngen resource table users --stream
 ```
 ```yml
    StreamSpecification:
      StreamViewType: NEW_IMAGE

 ```
  ###### Generate Lambda Handler
  For lambda handlers you can initialize with different types of events (stream, s3, Http (default))
 ```sh
 ngen resource handler users
 ```
 Which will create a new lambda handler under **src/resources/handlers/users.yml** as below
 ```yml
handleLambdaTrigger:
  handler: ""
  events:
    - http:
        path: ""
        method: ""
        cors: true
        request:
          schema: ""
 ```

You can add the authorizer option for http based event if you want a cognito authorizer scaffolding as below
```yml
  handleLambdaTrigger:
    handler: ""
    events:
      - http:
          path: ""
          method: ""
          cors: true
          authorizer:
            type: COGNITO_USER_POOLS
            authorizerId:
              Ref: ApiGatewayAuthorizer
 ```

 As for **--type stream** option will add Stream event instead of http
  ```sh
 ngen resource handler users --type stream
 ```
 ```yml
handleLambdaTrigger:
  handler: ""
  events:
    - stream:
        type: dynamodb
        batchSize: 1
        startingPosition: LATEST
        arn:
          FN::GetAtt:
            - tableResourceName
            - StreamArn

 ```
  And possibly  **--type s3** option will add S3 event as trigger
  ```sh
 ngen resource handler users --type s3
 ```
 ```yml
handleLambdaTrigger:
  handler: ""
  events:
    - s3:
        bucket: ""
        event: s3:ObjectCreated:*
        rules:
          - prefix: ""

 ```
 Optionally you can add the controller option if you want to link the lambda handler to a controller
 ```sh
 ngen resource handler users --controller UserController
 ```
 Which will create the link between both under **src/handlers/UserHandler.js**
