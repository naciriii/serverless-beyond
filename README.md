# LC1 Framework

LC1 framework created based on serverless framework to simplify development of microservices and automate tasks

## CLI Commands
The Cli **ngen** will handle the multiple tasks listed below

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
 Which result like below
 ```javascript
 const controller = require('./Controller')

    module.exports = class UserController extends controller {

        constructor() {
            super()

        }
    }
```
 Generate controller and initialize lambda handlers

```sh
 ngen controller $controllerName --handler
 ngen controller $controllerName --handler $customHandlerName
 ```
 Like below
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
 As For tables you can use either the initialization with/without index
 ```sh
 ngen resource table users --index
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
        - AttributeName: index_key
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
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
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1

 ```
