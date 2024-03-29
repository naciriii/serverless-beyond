const fs = require('fs')
const yaml = require('yaml')
const { parsePath } = require('../utils')

module.exports = function (shell, args) {
  let handler = args._[2]
  let type = args.type
  let authorizer = args.authorizer
  let link = args.link
  let controller = args.controller
  let data
  if (!handler) {
    throw new Error('you need to specify a handler name!')
  }
  if (!type || type === true) {
    type = 'http'
  }
  if (fs.existsSync('./src/resources/handlers/' + handler + '.yml')) {
    throw new Error('Handler already exists! ')
  }

  let scaffoldData = handlerStub(handler, type, authorizer, link, controller, shell)
  data = JSON.parse(scaffoldData)
  shell.exec(`echo '${yaml.stringify(data)}' > ${process.cwd()}/src/resources/handlers/${handler}.yml`)
  return `src/resources/handlers/${handler}.yml Added !`
}

function handlerStub (handler, type, authorizer, link, controller, shell) {
  let { path } = parsePath(handler)
  let handlerName = 'ControllerHandler.method'
  if (path) {
    shell.mkdir('-p', process.cwd() + '/src/resources/handlers/' + path)
  }
  if (link && link.length) {
    handlerName = link
  } else if (controller && controller !== true) {
    let { data, name } = controllerHandlerStub(controller)
    shell.exec(`echo "${data}" > ${process.cwd()}/src/handlers/${name.split('Controller')[0] + 'Handler'}.js`)
    handlerName = name.split('Controller')[0] + 'Handler'
  }

  let httpEvent = {
    http: {
      path: '',
      method: '',
      cors: true,
      request: {
        schema: ''
      }
    }
  }
  let streamEvent = {
    stream: {
      type: 'dynamodb',
      batchSize: 1,
      startingPosition: 'LATEST',
      arn: {
        'FN::GetAtt': ['tableResourceName', 'StreamArn']
      }
    }
  }
  let s3Event = {
    s3: {
      bucket: '',
      event: 's3:ObjectCreated:*',
      rules: [
        { prefix: '' }
      ]
    }
  }

  let data = {
    handleLambdaTrigger: {
      handler: 'src/handlers/' + handlerName,
      events: []
    }
  }
  if (type === 'http') {
    if (authorizer) {
      httpEvent.authorizer = {
        type: 'COGNITO_USER_POOLS',
        authorizerId: {
          Ref: 'ApiGatewayAuthorizer'
        }
      }
    }
    data.handleLambdaTrigger.events.push(httpEvent)
  } else if (type === 'stream') {
    data.handleLambdaTrigger.events.push(streamEvent)
  } else if (type === 's3') {
    data.handleLambdaTrigger.events.push(s3Event)
  }

  return JSON.stringify(data)
}

function controllerHandlerStub (controller) {
  let { name: controllerName } = parsePath(controller)
  let controllerPath = '../controllers/' + controller
  return { name: controllerName,
    data: `const ${controllerName} = require('${controllerPath}')

  module.exports = new ${controllerName}()` }
}
