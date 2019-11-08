module.exports = class Controller {
  /**
 * Helper method to return response directly
 * @param {Object} data
 * @param {Number} status
 */
  json (data, status = 200) {
    let res = {
      statusCode: status
    }
    if (data != null) {
      res.body = JSON.stringify(data)
    }

    return res
  }
}
