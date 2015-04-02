var assert = require('assert')
var mongo = require('mongoskin')
var store = require('../fips_cache').store
var checkCache = require('../fips_cache').checkCache
var dsn = require('../config').dsn
var db = mongo.db(dsn, {native_parser:true})

var test_fips = {
  lat: 666,
  lng: 444,
  fips: '12345',
  name: 'test'
}

suite('fips_cache')

test('store', function(done){
  store(test_fips, function(err, result){
    assert(result[0].name === 'test')
    checkCache(test_fips.lat, test_fips.lng, function(err, code){
      assert(code.name === 'test')
      assert(code.fips === '12345')
      done()
    })
  })
})

after(function(done){
  db.bind('fips_cache')
  db.fips_cache.remove({name:'test'}, function(err){
    done(err)
  })
})