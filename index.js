var express = require('express')
var app = express()
var http = require('http');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

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
		// str is a bit batch of HTML.
		
		response.send('Hello World: ' + str);
	  });
	}).end();
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
