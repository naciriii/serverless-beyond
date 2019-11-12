const { parsePath } = require('./utils')
module.exports = function (shell, name, args) {
  if (typeof name === 'undefined') {
    throw new TypeError('You need to specify a model name !')
  }
  let content = modelStub(name, shell, args.table)
  shell.exec('echo "' + content + '" >' + process.cwd() + '/src/models/' + name + '.js ')
  
  return 'src/models/' + name
}

function modelStub (modelName, shell, table) {
  let { name, path, basePath } = parsePath(modelName)
 


  if (path) {
    shell.mkdir('-p', process.cwd() + '/src/models/' + path)
    basemodelPath = basePath + 'model'
  } else {
    basemodelPath = './model'
    basePath.substr()
  }
  if(table) {
      if(table === true) {
        table = modelName.charAt(0).toLowerCase()+modelName.slice(1)
        table = table.charAt(table.length) === 's' ? table: table + 's'

      } } else {
          table = 'example_table'
      }
      return `const dynamoose = require('dynamoose')
    const uuid = require('uuid/v4')
    const tableName = process.env.STAGE + '_${table}'
    
    const ${modelName} = dynamoose.model(tableName, {
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
    
    module.exports = ${modelName}
    `

  


}

