const CsvStrategy = require('../services/Importers/CsvImportStrategy')
const JsonStrategy = require('../services/Importers/JsonImportStrategy')

module.exports = class AbstractImportService {
  constructor () {
    if (this.constructor === AbstractImportService) {
      throw new Error('cannot instanciate use either Apple or google')
    }
  }

  /**
   * Factory method to return import handler (callback)
   * Method to execute after extracting each row of the imported file
   * Return handler to delegate processing and loading to dynamodb after getting line
   * from csv/json
   */
  getImportHandler () {}

  /**
   * Factory method to get overrided by child classes (google/apple import services)
   * Returns Event body how to process each line from csv/json
   * Based on data extraction result, describe how each data type should be processed
   * Usually to commonize the data in order to load to ddb later
   * @param {String} extension
   */
  getLineProcessorCallback (extension) {}

  /**
   *
   * @param {String} type
   * Return the strategy of processing imported file either csv or json
   * Stream the file and process line by line through JSON/CSV parser
   */
  getStrategy (type) {
    let strategy
    switch (type) {
      case 'csv':
        strategy = new CsvStrategy()
        break
      case 'json':
        strategy = new JsonStrategy()
        break
    }
    return strategy
  }
  /**
 *
 * @param {String} bucket
 * @param {String} key
 * Template Method that respresents the algorithm /steps to follow
 * to perform ETL
 * 1- Extract
 * 2- Transform
 * 3- Load
 */
  importData (bucket, key) {
    let strategy = this.getStrategy(key.split('.')[1].trim())
    let handler = this.getImportHandler()
    let lineProcessorCallback = this.getLineProcessorCallback(key.split('.')[1].trim())
    let res = strategy.import(bucket, key, lineProcessorCallback, handler)
    return res
  }
}
