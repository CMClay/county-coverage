/*
 * Responsible for all the DB interactions
 */

var mongo = require('mongoskin')
var utils = require('./utils')
var _ = require('underscore')

module.exports = function(opts){
  if(!opts.dsn || !opts.dsn) throw new Error('No Mongo dsn or limit provided')
  var db = mongo.db(opts.dsn, {native_parser:true})
  var LIMIT = opts.limit
  var COLL = opts.name || 'fips_cache'
  return {
    createCollection: function (cb){
      db.createCollection(COLL, function(err, collection){
        if (err) return cb(err)
        console.log('Using ' + COLL + ' collection.');
        cb()
      });
    },

    getCollections: function (cb){
      db.collectionNames(function(err, items) {
        utils.filterCollections(items, cb)
      })
    },

    filterCollections: function (collArr, cb){
      var props = _.filter(collArr, function(c){
        var length = c.name.length
        var isMatch = c.name.substring(length - 9) === '_property'
        return isMatch
      })
      cb(null, _.pluck(props, 'name'))
    },

    getProperties: function (collection, cb){
      db.bind(collection)
      db[collection]
        .find({},{Latitude: 1, Longitude: 1})
        .limit(LIMIT)
        .toArray(cb)
    },

    checkCache: function (lat, lng, vendor, cb){
      db.bind(COLL)
      db[COLL].findOne({lat: lat, lng: lng}, function(err, result){
        if (err) return cb(err)
        if (result){
          cb(null, result)
        }else{
          utils.getFIPS(lat, lng, function(err, result){
            if(!result){
              console.log('No fips result:',lat,lng)
              return cb()
            }
            result.vendor = vendor
            store(result, cb)
          })
        }
      })
    },
    getCache: function (cb){
      db.bind(COLL)
      db[COLL].find().toArray(cb)
    }
  }
  function store(fipsObj, cb){
    db.bind(COLL)
    db[COLL].insert(fipsObj, cb)
  }
}
