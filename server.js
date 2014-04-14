var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require('fs');
var rt = require('./router.js');

var formOutput = '<html><body>'
    + '<h1>What to cook tonight - George Huynh\'s kitchen </h1>'
    + '<h2>Please provide data for fridges in CSV and recipes in JSON formats</h2>'
    + '<form method="post" action="." enctype="application/x-www-form-urlencoded"><fieldset>'
    + '<div><label for="fridgecsv">Fridge DATA (CSV format):</label><textarea  id="fridgecsv" name="fridgecsv" cols=40 rows=6></textarea></div>'
    + '<div><label for="fridgejson">Recipes DATA (JSON format)):</label><textarea id="fridgejson" name="fridgejson" cols=40 rows=6></textarea></div>'
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
                    console.log('CSVdatafridge');
                    console.log(CSVdatafridge);
                    if (!rt.checkDateInpuWithTodays(CSVdatafridge[3])){
                        console.log(CSVdatafridge[0] + ' can not be used!');
                    }else{
                        var CSVdatafridgearr = {"item": CSVdatafridge[0], "amount": CSVdatafridge[1], "unit": CSVdatafridge[3]};
					    fridge.push(CSVdatafridgearr);
                    }
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
                        if (rt.checkfridge(fridge, ingredients.item, ingredients.amount, ingredients.unit)){
                            var ret1 = {"name" : name, "item": ingredients.item, "amount": ingredients.amount, "unit": ingredients.unit};
                        }

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


