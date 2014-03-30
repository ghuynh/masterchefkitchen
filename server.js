var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require('fs');
// var $ = jQuery = require('jQuery');
// require('./jquery.csv.js');


var formOutput = '<html><body>'
    + '<h1>What to cook tonight - George Huynh\'s kitchen </h1>'
    + '<h2>Please provide data for fridges in CSV and JSON formats</h2>'
    + '<form method="post" action="." enctype="application/x-www-form-urlencoded"><fieldset>'
    + '<div><label for="fridgecsv">CSV DATA:</label><textarea  id="fridgecsv" name="fridgecsv" cols=40 rows=6></textarea></div>'
    + '<div><label for="fridgejson">JSON DATA:</label><textarea id="fridgejson" name="fridgejson" cols=40 rows=6></textarea></div>'
	+ '<div><input id="Post" type="submit" value="Advise what to cook tonight?" /></div></fieldset></form></body></html>';
function start(route){
function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
	if(request.method == "GET") {
    		response.writeHead(200, {'Content-Type': 'text/html'});
	        response.end(formOutput);
	} else if (request.method == "POST"){

		var requestBody = "";
		request.on('data', function(data) {
			requestBody += data;

		});
		request.on('end', function() {
  console.log('Data=');
  console.log(requestBody);
  
  
            try{
				var CSVdata = qs.parse(requestBody);
				var fridge = new Array();

  console.log('CSVdata');
  console.log(CSVdata.fridgecsv);
				CSVdatafridgecsv = CSVdata.fridgecsv;
				for (var i=0, len = CSVdatafridgecsv.length; i < len; i++) {
					var CSVdatafridge = CSVdatafridgecsv[i].split(",");
					fridge.push(CSVdatafridge);
				}
  console.log('CSVdata array');
  console.log(fridge);				
				
			    var JSONdata = JSON.parse(CSVdata.fridgejson);
  console.log('Json data');
  console.log(JSONdata);




                var ret = new Array();
                for (var prop in JSONdata){

                    var value = JSONdata[prop];
                    var name = value.name;
                    var ingredients = value.ingredients;

                    if (name){
                        var ret1 = {"item": ingredients.item, "amount": ingredients.amount, "unit": ingredients.unit};
                        ret.push((ret1));
                    }

                }

                var result = {'response' : ret};
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(result));
                response.end();

            } catch (e) {
                response.writeHead(400, {"Content-Type": "application/json"});
                var error = new Error("Could not decode request: JSON parsing failed");
                response.write(JSON.stringify({"error":  "Could not decode request: JSON parsing failed"}));
                response.end();

            }

		});
	}
    route(pathname);

}

http.createServer(onRequest).listen(process.env.PORT || 5000);
console.log("Server started and listening at " + process.env.PORT);
}
exports.start = start;


