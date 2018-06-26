
var assert = require('assert')

var jsonUtils = require('../json-utils.js')

describe('json-utils', function() {

  describe('readJSONSync', function() {

    it('valid', function() {
      var fileName = __dirname + '/data/valid_content.json'
      var data = jsonUtils.readJSONSync(fileName)
      assert.ok(data)
      assert.equal(data.foo, 'bar')
    })
    
    it('invalid', function() {
      var fileName = __dirname + '/data/invalid_content_simple.json'
      try {
        jsonUtils.readJSONSync(fileName)
        assert.fail('expected an error to be thrown')
      } catch(err) {
        assert.ok(~err.message.indexOf(fileName))
        assert.equal(err.line, 2)
        assert.equal(err.character, 10)
      }
    })

  })
})
