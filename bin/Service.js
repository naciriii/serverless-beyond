const { parsePath } = require('./utils')
module.exports = function (shell, name, args) {
  if (typeof name === 'undefined') {
    throw new TypeError('You need to specify a Service name !')
  }
  let content = serviceStub(name, shell)
  shell.exec('echo "' + content + '" >' + process.cwd() + '/src/services/' + name + '.js ')
  return 'src/services/' + name
}

function serviceStub (serviceName, shell) {
  let { name, path } = parsePath(serviceName)

  if (path) {
    shell.mkdir('-p', process.cwd() + '/src/services/' + path)
  }
  return `module.exports = class ${name} {

       
    }`
}
