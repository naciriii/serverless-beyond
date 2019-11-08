const chai = require('chai')
const assert = chai.assert
const AppleReceiptsController = require('../../../controllers/apple/ReceiptsController')
const AppleReceiptsService = require('../../../services/apple/ReceiptsService')
const Faker = require('../../fixtures/receipts')
const Mocker = require('../../utils')
const Purchase = require('../../../models/Purchase')

describe('Example unit testsuite', () => {
  var receiptsController

  before(() => {
    receiptsController = new AppleReceiptsController(new AppleReceiptsService())
  })
  it('should validate receipt', async function () {
    this.timeout(5000)

    let { context, event } = Mocker.mockEvent('http', Faker.appleReceipt)
    let expected = {
      statusCode: 200,
      body: { result: { app_id: '',
        meta: '',
        userId: '',
        id: '',
        applicationId: '',
        productId: '',
        transactionId: '',
        purchaseDate: '',
        expiryDate: '',
        isAutoRenewable: '',
        createdAt: '',
        updatedAt: '',
        data: '' }
      }
    }
    let response = await receiptsController.handlePostAppleReceiptVerification(event, context)
    assert.hasAllKeys(response, ['statusCode', 'body'])
    assert.equal(response.statusCode, 200)
    assert.hasAllKeys(JSON.parse(response.body).result, expected.body.result)
    assert.exists(await Purchase.get('apple-590000355766366'))

    /*   assert.throws(async () => {

    },Error,"Not Allowed") */
  })
  it('should throw Not Allowed Exception', async function () {
    this.timeout(5000)
    let { context, event } = Mocker.mockEvent('http', Faker.appleReceipt)
    event.requestContext.authorizer.appId = 'com.dummy.app'
    let response = await receiptsController.handlePostAppleReceiptVerification(event, context)
    assert.equal(response.statusCode, 401)
    assert.strictEqual(response.body, '{"result":"Not Allowed"}')
  })
  after(async () => {
    // await Mocker.clearDb('purchases')
  })
})
