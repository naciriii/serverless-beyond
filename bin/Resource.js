const { parsePath } = require('./utils')
const yaml = require('yaml')
const fs = require('fs')
module.exports = function (shell, name, args) {
    let response
    let file 
    let data 
    switch(name) {
        case 'handler':
                let handler = args._[2]
                let type  = args.type
                let authorizer = args.authorizer
                if(!handler) {
                    throw new Error('you need to specify a handler name!')
                }
                if(!type || type === true) {
                    type = 'http'
                }
            if(fs.existsSync('./src/resources/handlers/'+handler+'.yml')) {
                throw new Error('Handler already exists! ')
            }

            let scaffoldData = handlerStub(handler,type, authorizer, shell)
            data = JSON.parse(scaffoldData)
            console.log(data)
        shell.exec(`echo '${yaml.stringify(data)}' > ${process.cwd()}/src/resources/handlers/${handler}.yml`)
        response = `src/resources/handlers/${handler}.yml Added !`

            break;

        case 'table':
            let table = args._[2]
            let addStream = args.stream
            if(!table) {
                throw new Error('You need to specify a table name!')
            }
             file  = fs.readFileSync('./src/resources/dynamodb.yml', 'utf-8')
             data = yaml.parse(file)
             data = data === null ? {Resources: {}}: data
             data.Resources = data.Resources === null ? {}: data.Resources
             data.Resources[table+'Table'] = JSON.parse(tableStub(table, args.index, addStream))
             shell.exec(`echo '${yaml.stringify(data)}' > src/resources/dynamodb.yml`)
             response = table+'Table Added !'                
            break;
        default:
            throw new Error ('undefined Resource type !') 
                 
    }
    return response;

}

function tableStub(table, index, addStream) {
    let data
    if(index) {
        data =  '{"Type":"AWS::DynamoDB::Table","Properties":{"TableName":"${self:provider.stage}_'+table+'","AttributeDefinitions":[{"AttributeName":"id","AttributeType":"S"},{"AttributeName":"index_key","AttributeType":"S"}],"KeySchema":[{"AttributeName":"id","KeyType":"HASH"}],"GlobalSecondaryIndexes":[{"IndexName":"indexName","KeySchema":[{"AttributeName":"index_key","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"},"ProvisionedThroughput":{"ReadCapacityUnits":1,"WriteCapacityUnits":1}}],"ProvisionedThroughput":{"ReadCapacityUnits":1,"WriteCapacityUnits":1}}}'
    }else {
        data = '{"Type":"AWS::DynamoDB::Table","Properties":{"TableName":"${self:provider.stage}_'+table+'","AttributeDefinitions":[{"AttributeName":"id","AttributeType":"S"}],"KeySchema":[{"AttributeName":"id","KeyType":"HASH"}],"ProvisionedThroughput":{"ReadCapacityUnits":1,"WriteCapacityUnits":1}}}'
    }
     if(addStream) {
        data = JSON.parse(data)

          data.StreamSpecification = {
             StreamViewType: "NEW_IMAGE"
         } 
         data = JSON.stringify(data)
     }

     return data
}

function handlerStub(handler, type, authorizer, shell) {
    let { name, path, basePath } = parsePath(handler)
    if (path) {
        shell.mkdir('-p', process.cwd() + '/src/resources/handlers/' + path)
      }
      file  = fs.readFileSync('./src/resources/handlers/appFamilies.yml', 'utf-8')
             let httpEvent = {
                http: {
                    path: "",
                    method: "",
                    cors: true,
                    request: {
                        schema: ""
                    }

                }
            }
            let streamEvent = {
                stream: {
                    type: "s3 or dynamodb",
                    batchSize: "1",
                    startingPosition: "LATEST",
                    arn: {
                        "FN::GetAtt": ["table", "StreamArn"]
                    }
                }
            }
             let data = {
                 handleLambdaTrigger: {
                     handler: "",
                     events: []
                 }
             }
             if(type === 'http') {
                 if(authorizer) {
                    httpEvent.authorizer = {
                        type: "COGNITO_USER_POOLS",
                        authorizerId: {
                            Ref: "ApiGatewayAuthorizer"
                        }
                    }
                    data.handleLambdaTrigger.events.push(httpEvent)

                }

             } else if(type === 'stream') {
                data.handleLambdaTrigger.events.push(streamEvent)


             }
             
      return JSON.stringify(data)

}