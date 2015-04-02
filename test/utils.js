var assert = require('assert')
var utils = require('../utils')
var _ = require('underscore')

suite('utils')

test('utils.getFIPS', function(done){
  utils.getFIPS(28.36, -81.422, function(err, result){
    assert(typeof result === 'object', 'result not an Object')
    assert(result.name === 'Orange', 'result has incorrect name')
    assert(result.fips === '12095', 'result has incorrect code')
    done()
  })
})

test('utils.getPropertyCollections', function(done){
  var collections = ['test', 'users', 'mls_property','test_property','anotherproperty','1_property2']
  collections = _.map(collections, function(c){return {name:c}})
  var result = utils.getPropertyCollections(collections);
  assert(result.length === 2)
  assert(!!~result.indexOf('mls_property'))
  assert(!!~result.indexOf('test_property'))
  done()
})

test('compareLats', function(done){
  assert(utils.compareLats(20.1385, 20.139), 'compare fail 1')
  assert(utils.compareLats(255, 254.9997), 'compare fail 2')
  assert(utils.compareLats(-123.1263, -123.126), 'compare fail 3')
  assert(!utils.compareLats(21.138, 21.134), 'compare fail 4')
  assert(!utils.compareLats(-80, 80), 'compare fail 5')
  assert(!utils.compareLats(125.67, 126), 'compare fail 6')
  done()
})