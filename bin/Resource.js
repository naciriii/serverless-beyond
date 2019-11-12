const { parsePath } = require('./utils')
const y = require('yaml')
module.exports = function (shell, name, args) {
    let response
    switch(name) {
        case 'handler':

            break;

        case 'table':
                let data  = {"handleGetAppFambilies":{"handler":"src/handlers/api/appFamiliesHandler.handleGetAppFamilies","events":[{"http":{"path":"appFamilies","method":"get","cors":true,"authorizer":{"type":"COGNITO_USER_POOLS","authorizerId":{"Ref":"ApiGatewayAuthorizer"}}}}]}}
                response = y.stringify(data)
                    console.log(response)
                
            shell.exec(`echo '${response}'>> src/resources/handlers/appFamilies.yml`)
            break;
        default:
            throw new Error ('undefined Resource type !') 
            break;       
    }
    return response;

}