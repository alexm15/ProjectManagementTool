var trello = (function(){
    var listJSON_FromTrello;
    var dataLoaded = false;
    google.charts.load('current', { 'packages': ['gantt'] });
    
    


    function getList() {
        var list = Trello.lists.get('5a008ddf7f0afee2bb74b510', { cards: "open" }, function () {
            //console.log("list successfully retrieved");
            listJSON_FromTrello = JSON.parse(list.responseText);
            google.charts.setOnLoadCallback(ganttChart.drawChart(listJSON_FromTrello));
            refreshList();
        });
    }

    function refreshList() {
        getList();
    
        clearList();
        $("#listName").html(listJSON_FromTrello.name);
        for (var i = 0; i < listJSON_FromTrello.cards.length; i++) {
            $(".list-group").append(
                '<a class="list-group-item">' +
                '<h4 class="list-group-item-heading">' + listJSON_FromTrello.cards[i].name + '</h4>' +
                '<p class="list-group-item-text">' + listJSON_FromTrello.cards[i].desc + '</p>' +
                '</a>')
        }
    }

    $(document).ready(function () {
        setInterval(getList(), 1000);
    });

    function clearList() {
        $(".list-group-item").remove();
        $(".list-group-item-heading").remove();
        $(".list-group-item-text").remove();
    }
    
    function authenticationSuccess() {
        console.log('Successful authentication');
    };
    
    function authenticationFailure() {
        console.log('Failed authentication');
    };
    
    
    window.Trello.authorize({
        type: 'popup',
        name: 'Getting Started Application',
        scope: {
            read: 'true',
            write: 'true'
        },
        expiration: 'never',
        success: authenticationSuccess,
        error: authenticationFailure
    });
    
    var myList = '5a008ddf7f0afee2bb74b510';
    
    function creationSuccess(data) {
        console.log('Card created successfully.');
        console.log(JSON.stringify(data, null, 2));
    };
    
    function createCard(card_name, card_desc, start_date, due_date) {
    
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
    
    
    function convertStringToDate(dateAsString) {
        console.log("date to convert: " + dateAsString);
        var dateArray = dateAsString.split("-");
        var dateObj = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]); //month is 0-based
        return dateObj;
    }
    
    function appendStartDate(date) {
        console.log("Before convertion to date: " + date)
        var dateObj = convertStringToDate(date);
        console.log("after convertion: " + dateObj)
        console.log("As ISOString: " + dateObj.toISOString());
        return " Start Date:" + dateObj.toISOString();
    
    }
    
    

    return {
        createCard : createCard
    }
})();