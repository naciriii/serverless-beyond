const { parsePath } = require('./utils')
const yaml = require('yaml')
const fs = require('fs')
module.exports = function (shell, name, args) {
    let response
    let file 
    let data 
    switch(name) {
        case 'handler':
        file  = fs.readFileSync('./src/resources/handlers/appFamilies.yml', 'utf-8')
        data = yaml.parse(file)
        shell.exec(`echo '${yaml.stringify(data)}' >> src/resources/handlers/newHandler.yml`)
        response = data
            break;

        case 'table':
            let table = args._[2]
            let addStream = args.stream
            if(!table) {
                throw new Error('you need to specify a table name!')
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