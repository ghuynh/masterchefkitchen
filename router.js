function route(pathname){
	console.log("Request from " + pathname);

}

function checkDateInpuWithTodays(inputdate) {
    //get today's date in string
    var todayDate = new Date();
    //need to add one to get current month as it is start with 0
    var todayMonth = todayDate.getMonth() + 1;
    var todayDay = todayDate.getDate();
    var todayYear = todayDate.getFullYear();
    var todayDateText = todayDay + "/" + todayMonth + "/" + todayYear;

//Convert both input to date type
    var inputToDate = Date.parse(inputdate);
    var todayToDate = Date.parse(todayDateText);
    //

//compare dates
    if (inputToDate > todayToDate) {
        console.log("the food is expired, can not be used");
        return false;
    }

    else {
        console.log("the food is ok to use");
        return true;
    }
}

function checkfridge(fridge, ingredientsitem, ingredientsamount, ingredientsunit) {
    for (var i = 0; i < fridge.length; i++) {
        if (fridge[i].indexOf(ingredientsitem) >= 0) {
            if (fridge[i].amount <= ingredientsamount && fridge[i].unit == ingredientsunit) {
                fridge[i].amount = fridge[i].amount - ingredientsamount;
                return fridge[i];
            }
        }
    }
}

exports.route = route;
exports.checkfridge = checkfridge;
exports.checkDateInpuWithTodays = checkDateInpuWithTodays;
