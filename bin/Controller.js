const { parsePath } = require('./utils')
module.exports = function (shell, name, args) {
  if (typeof name === 'undefined') {
    throw new TypeError('You need to specify a controller name !')
  }
  let content = controllerStub(name, shell)
  shell.exec('echo "' + content + '" >' + process.cwd() + '/src/controllers/' + name + '.js ')
  if (args.handler) {
    let handlerName = args.handler !== true ? args.handler : name.split('/').pop().split('Controller')[0] + 'Handler'
    let content = handlerStub(handlerName, name, shell)
    shell.exec('echo "' + content + '" >' + process.cwd() + '/src/handlers/' + handlerName + '.js ')
  }
  return 'src/controllers/' + name
}

function controllerStub (controllerName, shell) {
  let { name, path, basePath } = parsePath(controllerName)
  let baseControllerPath

  if (path) {
    shell.mkdir('-p', process.cwd() + '/src/controllers/' + path)
    baseControllerPath = basePath + 'Controller'
  } else {
    baseControllerPath = './Controller'
  }

  return `const controller = require('${baseControllerPath}')

    module.exports = class ${name} extends controller {

        constructor() {
            super()

        }
    }`
}
function handlerStub (handlerName, controller, shell) {
  let { name, basePath, path } = parsePath(handlerName)
  let { name: controllerName } = parsePath(controller)
  let controllerPath = '../' + basePath + 'controllers/' + controller
  if (path) {
    shell.mkdir('-p', process.cwd() + '/src/handlers/' + path)
  }

  return `const ${controllerName} = require('${controllerPath}')

/**
 */   
module.exports = new ${controllerName}()`
}
