var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require('fs');
// Include the two functions: checkDateInpuWithTodays and checkfridge
var func = require("./functions.js");

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

            try{
				var CSVdata = qs.parse(requestBody);
				var fridge = new Array();

				CSVdatafridgecsv = CSVdata.fridgecsv;
				for (var i=0, len = CSVdatafridgecsv.length; i < len; i++) {
					var CSVdatafridge = CSVdatafridgecsv[i].split(",");
                    // Check if the item is expired
                    if (!func.checkDateInpuWithTodays(CSVdatafridge[3])){
                        console.log(CSVdatafridge[0] + ' can not be used!');
                    }else{
                        var CSVdatafridgearr = {"item": CSVdatafridge[0], "amount": CSVdatafridge[1], "unit": CSVdatafridge[3]};
					    fridge.push(CSVdatafridgearr);
                    }
				}

			    var JSONdata = JSON.parse(CSVdata.fridgejson);

                var dishdetails = new Array();
                for (var prop in JSONdata){

                    var value = JSONdata[prop];
                    var name = value.name;
                    var ingredients = value.ingredients;

                    if (name){
                        // compare with the items in the fridge (item, amount, unit) to find out if the item is enough to cook
                        if (func.checkfridge(fridge, ingredients.item, ingredients.amount, ingredients.unit)){
                            var chosendish = {"name" : name, "item": ingredients.item, "amount": ingredients.amount, "unit": ingredients.unit};
                        }

                        dishdetails.push((chosendish));
                    }

                }
                var result = {'response' : dishdetails};
                response.writeHead(200, {"Content-Type": "application/json"});
                // Return the dish in Jason format.
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


