var es = require('elasticsearch')
const fs = require('fs');
// Set ElasticSearch location and port
var client = new es.Client({
    host : 'localhost:9200'
});
var lol=[];

var obj = JSON.parse(fs.readFileSync('models.json', 'utf8'))
var i = 1
obj.forEach(function(model)
{
  lol.push( {index : { _index: 'index', _type: 'model', _id: i }})
  lol.push({ doc: model})
  i++
});


client.bulk({
  body : lol
}, function (err, resp)  {
});
