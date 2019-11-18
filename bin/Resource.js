
module.exports = function (shell, name, args) {
  let response
  switch (name) {
    case 'handler':
      response = require('./resources/Handler')(shell, args)
      break
    case 'table':
      response = require('./resources/Table')(shell, args)
      break
    default:
      throw new Error('undefined Resource type !')
  }
  return response
}
