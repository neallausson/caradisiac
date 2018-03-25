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


    }

    else if (page == '/suv') {

        res.write('Hé ho, c\'est privé ici !');

    }

  res.end();

});

server.listen(9292);
