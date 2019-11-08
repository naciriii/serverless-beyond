const { parsePath } = require('./utils')
module.exports = function (shell, name, args) {
  if (typeof name === 'undefined') {
    throw new TypeError('You need to specify a controller name !')
  }
  let content = requestStub(name, shell)

  shell.exec(`echo '${content}' > ${process.cwd()}/src/requests/${name}.json `)

  return 'src/requests/' + name + '.json '
}
function requestStub (requestName, shell) {
  let { name, path } = parsePath(requestName)
  if (path) {
    shell.mkdir('-p', process.cwd() + '/src/requests/' + path)
  }

  return new String(`{
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "title": "${name} request Schema",
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
      }`)
}
