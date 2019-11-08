exports.parsePath = function (str) {
  let arr = str.split('/')
  let name = arr.pop()
  let path = arr.join('/')
  let basePath = ''
  arr.forEach((item) => {
    basePath += '../'
  })
  return {
    name,
    basePath,
    path
  }
}
