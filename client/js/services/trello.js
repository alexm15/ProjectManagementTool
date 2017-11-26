var listJSON_FromTrello;
var dataLoaded = false;
// var list = Trello.lists.get('5a008ddf7f0afee2bb74b510', {cards: "open"}, function() {
//     console.log("list successfully retrieved");
//     listJSON_FromTrello = JSON.parse(list.responseText);
// });



/**
 * Google charts for Gantt charts.
 */
function daysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000;
  }
  
function drawChart() {
  
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');
  
  
    var options = {
      height: 275
    };
  
    var trelloCards = listJSON_FromTrello.cards;
    for (var index = 0; index < trelloCards.length; index++) {
        var id = trelloCards[index].id
        var name = trelloCards[index].name
        var start_date = getStartDate(trelloCards[index])
        var due_date = getDueDate(trelloCards[index])
        data.addRow([id, name, "Trello Card", start_date, due_date, null, 0, null]);     
    }

    var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
    chart.draw(data, options);
  }  

var getStartDate = function(card) {
    if(card.desc.includes("Start Date:")){
        var posOfColon = card.desc.search(":");
        // console.log("':' position: " + posOfColon);

        var dateSubstring = card.desc.substring(posOfColon+1, card.desc.length)
        // console.log("date substring: " + dateSubstring);
        // console.log(card.name + " start date: " + new Date(dateSubstring));
        return new Date(dateSubstring);
    }
    else {
        console.log(card.name + " start date: " + new Date(2017, 10, 01));
        return new Date(2017, 10, 01); //default start date
    } 
}

var getDueDate = function(card) {
    if(card.due !== null) {
        // console.log(card.name + " due date: " + new Date(card.due));
        return new Date(card.due);
    }
    else {
        console.log(card.name + " due date: " + new Date(2017, 11, 15));
        return new Date(2017, 11, 15); // default due date
    } 
}


/* Trello api calls
//Lists on a board 
//GET boards/[board_id]/lists

//Cards on a list
//GET lists/[idList]/cards

*/

var getList = function() {
    var list = Trello.lists.get('5a008ddf7f0afee2bb74b510', {cards: "open"}, function() {
        console.log("list successfully retrieved");
        listJSON_FromTrello = JSON.parse(list.responseText);
        dataLoaded = true;
    });
}

$("#refresh_list_btn").click(function(){
    getList();
    if(dataLoaded === false)
        $(".list-group").html('<p id="loadingData"> Press refresh button untill data is loaded/updated </p>');
    else {
        clearList();
        $("#listName").html(listJSON_FromTrello.name);
        for (var i = 0; i < listJSON_FromTrello.cards.length; i++) {
            $(".list-group").append(
                '<a class="list-group-item">'+
                '<h4 class="list-group-item-heading">' + listJSON_FromTrello.cards[i].name + '</h4>' + 
                '<p class="list-group-item-text">'+ listJSON_FromTrello.cards[i].desc+'</p>' +
                '</a>') 
        }
        google.charts.load('current', {'packages':['gantt']});
        google.charts.setOnLoadCallback(drawChart);
        
        
    }
    
});

var clearList = function() {
    $(".list-group-item").remove();
    $(".list-group-item-heading").remove();
    $(".list-group-item-text").remove();
}

var authenticationSuccess = function() {
    console.log('Successful authentication');
};

var authenticationFailure = function() {
    console.log('Failed authentication');
};


window.Trello.authorize({
    type: 'popup',
    name: 'Getting Started Application',
    scope: {
        read: 'true',
        write: 'true' },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
});

var myList = '5a008ddf7f0afee2bb74b510';

var creationSuccess = function (data) {
    console.log('Card created successfully.');
    console.log(JSON.stringify(data, null, 2));
};

var createCard = function(card_name, card_desc, start_date, due_date) {   

    var newCard = {
        name: card_name, 
        desc: card_desc + appendStartDate(start_date),
        due: convertStringToDate(due_date).toISOString(),
        // Place this card at the top of our list 
        idList: myList,
        pos: 'top'
    };

    Trello.post('/cards/', newCard, creationSuccess);    
}


var convertStringToDate = function(dateAsString) {
    console.log("date to convert: " + dateAsString);
    var dateArray = dateAsString.split("-");
    var dateObj = new Date(dateArray[0], dateArray[1]-1, dateArray[2]); //month is 0-based
    return dateObj;
}

var appendStartDate = function(date) {
    console.log("Before convertion to date: " + date)
    var dateObj = convertStringToDate(date);
    console.log("after convertion: " + dateObj)
    console.log("As ISOString: " + dateObj.toISOString());
    return " Start Date:" + dateObj.toISOString();

}