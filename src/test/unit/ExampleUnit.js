const chai = require('chai')
const assert = chai.assert
const Faker = require('../../fixtures/receipts')
const Mocker = require('../../utils')

describe('Example unit testsuite', () => {
  before(() => {
  })
  it('should do something', async function () {
    this.timeout(5000)

    assert.isTrue(true)
  })

  after(async () => {
  })
})
