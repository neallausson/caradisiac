const http = require('http');
const url = require("url");
const fs = require('fs');
const es = require('elasticsearch')

var client = new es.Client({
    host : 'localhost:9200'
});
var server = http.createServer(function(req, res) {
  var page = url.parse(req.url).pathname;
  console.log(page);

  res.writeHead(200, {"Content-Type": "text/html"});

  if (page == '/') {

        res.write('<!DOCTYPE html>'+

      '<html>'+

      '    <head>'+

      '        <meta charset="utf-8" />'+

      '        <title>Caradisiac de Neal LAUSSON !</title>'+

      '    </head>'+

      '    <body>'+
      '<p>Caradisiac de Neal LAUSSON !</p>'+
      '<p>avec /populate vous indexez les models de voiture dans ElasticSearch</p>'+
      '<a href="http://localhost:9292/populate">indexez les models</a>'+
      '</body>'+
      '</html>');

    }

    else if (page == '/populate') {



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
      
      res.write('<!DOCTYPE html>'+

    '<html>'+

    '    <head>'+

    '        <meta charset="utf-8" />'+

    '        <title>Indexation de la base de données</title>'+

    '    </head>'+

    '    <body>'+
    '<p>Caradisiac de Neal LAUSSON !</p>'+
    '<p>nous sommes entrain d\'indexer la base de Données </p>'+
    '<p>avec /suv vous afficherez les 10 voitures avec les plus gros volumes</p>'+
    '<a href="http://localhost:9292/suv">affichez les 10 voitures avec les plus gros volumes </a>'+
    '</body>'+
    '</html>');
    res.end();


    }

    else if (page == '/suv') {

        //res.write('Hé ho, c\'est privé ici !');
        client.search({
          index: 'index',
          type: 'model',
          'body': {
            'size': 10,
            'sort': [
                {
                    'doc.volume.keyword': {
                        'order': 'desc'
                    }
                }
            ],
            'query': {
                'match_all': {}
              }
          }
        }
      ,function (error, response,status) {
            if (error){
              console.log("search error: "+error)
              res.write("Don't forget to index the models ");
              res.end();
            }
            else {
              console.log("--- Response ---");
              console.log(response);
              console.log("--- Hits ---");
              var toshow ="<p>les 10 voitures avec le plus gros volumes :</p>";
              response.hits.hits.forEach(function(hit){
                console.log(hit._source.doc.model + " : volume " + hit._source.doc.volume);
                toshow = toshow +"<p>" +hit._source.doc.model + " : volume " +hit._source.doc.volume+"</p>" ;
                //res.write(hit._source.doc.model + " : volume " +hit._source.doc.volume);
              })
              res.write(toshow);
              res.end();
            }
        });

    }



});

server.listen(9292);
