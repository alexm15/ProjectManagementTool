var ganttChart = (function () {
    

    function test() {
        console.log("hello world!");
    }

    function drawChart(trelloList) {


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

        var trelloCards = trelloList.cards;
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

    /**
    * Google charts for Gantt charts.
    */
    function daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }

    function getStartDate(card) {
        if (card.desc.includes("Start Date:")) {
            var posOfColon = card.desc.search(":");
            // console.log("':' position: " + posOfColon);

            var dateSubstring = card.desc.substring(posOfColon + 1, card.desc.length)
            // console.log("date substring: " + dateSubstring);
            // console.log(card.name + " start date: " + new Date(dateSubstring));
            return new Date(dateSubstring);
        }
        else {
            console.log(card.name + " start date: " + new Date(2017, 10, 01));
            return new Date(2017, 10, 01); //default start date
        }
    }

    function getDueDate(card) {
        if (card.due !== null) {
            // console.log(card.name + " due date: " + new Date(card.due));
            return new Date(card.due);
        }
        else {
            console.log(card.name + " due date: " + new Date(2017, 11, 15));
            return new Date(2017, 11, 15); // default due date
        }
    }

    return {
        test: test,
        drawChart : drawChart
    };
})();





