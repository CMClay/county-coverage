var _ = require('underscore')
var http = require('http')
var fs = require('fs')
var us = require('../public/us.json')

/*
 * geo {lat: '33.443', lng: '434.32'}
 var fips = out.County.FIPS
 */
function getFIPS(lat, lng, cb){
  var options = {
    host: 'data.fcc.gov',
    path: '/api/block/find?format=json&latitude=' + lat + '&longitude=' + lng + '&showall=true'
  }

  http.get(options, function(res) {
    // console.log('Making request: ' + options.host + options.path)
    res.on("data", function(data) {
      try{
        var obj = JSON.parse('' + data)
      }catch (e){
        return cb(new Error('Invalid fips request'))
      }

      if(obj.County && obj.County.FIPS){
        var result = {
          lat:lat,
          lng: lng,
          name: obj.County.name,
          fips: obj.County.FIPS
        }
        cb(null, result)
      }
    });
  }).on('error', function(e) {
    cb(new Error("Got error: " + e.message))
  });
}

/*
 * arr [{vendor: {imls}, properties:[{fips:'1021', lat:,lng:}]}]
 */
function writeCSV(data, dest, cb){
  var str = ''
  str += 'id,count\n'
  for (var id in data){
    var count = data[id]
    id = sanitize(id)
    str += id + ',' + count + '\n'
  }

  fs.writeFile(dest, str, function(err){
    if (err) throw err
    console.log(dest + ' was saved.')
    cb()
  })
}

function sortData(arr){
  ids = _.pluck(us.objects.counties.geometries, 'id')
  result = {}
  ids.forEach(function(i){
    result[i] = 0
  })
  arr.forEach(function(p){
    p.fips = sanitize(p.fips)
    if(result[p.fips] !== null)
      result[p.fips]++
    else
      throw new Error('Invalid fip: ' + p.fips)
  })
  return result
}

function sanitize(fip){
  while (fip[0] === '0'){
    fip = fip.substring(1)
  }
  return fip
}

function compareLats(lat1, lat2){
  return Math.round(lat1 * 1000) === Math.round(lat2 * 1000)
}

function colName(collection){
  return collection.substring(0, collection.length - 9)
}

function filterCollections(collArr, cb){
  var props = _.filter(collArr, function(c){
    var length = c.name.length
    var isMatch = c.name.substring(length - 9) === '_property'
    return isMatch
  })
  cb(null, _.pluck(props, 'name'))
}

module.exports = {
  filterCollections: filterCollections,
  sortData: sortData,
  getFIPS: getFIPS,
  writeCSV: writeCSV,
  compareLats: compareLats,
  colName: colName
}
