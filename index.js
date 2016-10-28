var express = require('express')
var app = express()
var http = require('http');
var pg = require('pg');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/dbsetup', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('create table result_table (id integer, html text)', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});

app.get('/dbinit', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO result_table VALUES (1, '')', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result); }
    });
  });
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM result_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
});

function saveToDB(result) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('UPDATE result_table SET text = "' + result + '"', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
}

function getFromDB() {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM result_table WHERE id = 1', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
}

var options = {
  host: 'www.klwines.com',
  path: '/Products/r?s=System.Web.HttpCookie&d=29&r=4294956958%2B40&z=False&o=0&displayCount=500'
};

app.get('/', function(request, response) {
	http.request(options, function(resp) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  resp.on('data', function (chunk) {
		str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  resp.on('end', function () {
		// str is a big batch of HTML.
		try {
			// strip everything before <div class="results-block clearfix"> until <div class="page-filters-block clearfix">
			if (str && str.substring) {
				str = str.substring(str.indexOf("results-block clearfix"), str.indexOf("function IncludeOutOfStock"));
				
				saveToDB(str);
			} else {
				str = "Error: response not a string!: " + str;
			}
		} catch (err) {
			str = "ERROR! " + err + ": " + err.message;
		}
		response.send(str);
	  });
	}).end();
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
