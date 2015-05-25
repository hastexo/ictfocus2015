function barChart(name, xkey, ykeys, labels) {
    $.ajax({
        type: "GET",
        url: "charts/" + name + ".csv",
        dataType: "text",
        success: function(data) {
	    var csv = $.csv.toObjects(data)
	    new Morris.Bar({
		// ID of the element in which to draw the chart.
		element: "chart-" + name,
		// Chart data records -- each entry in this array corresponds to a point on
		// the chart.
		data: csv,
		// The name of the data record attribute that contains x-values.
		xkey: xkey,
		// A list of names of data record attributes that contain y-values.
		ykeys: ykeys,
		// Labels for the ykeys -- will be displayed when you hover over the
		// chart.
		labels: labels
	    })
	}
     });
}

function lineChart(name, xkey, ykeys, labels) {
    $.ajax({
        type: "GET",
        url: "charts/" + name + ".csv",
        dataType: "text",
        success: function(data) {
	    var csv = $.csv.toObjects(data)
	    new Morris.Line({
		// ID of the element in which to draw the chart.
		element: "chart-" + name,
		// Chart data records -- each entry in this array corresponds to a point on
		// the chart.
		data: csv,
		// The name of the data record attribute that contains x-values.
		xkey: xkey,
		// A list of names of data record attributes that contain y-values.
		ykeys: ykeys,
		// Labels for the ykeys -- will be displayed when you hover over the
		// chart.
		labels: labels
	    })
	}
     });
}

function donutChart(name) {
    $.ajax({
        type: "GET",
        url: "charts/" + name + ".csv",
        dataType: "text",
        success: function(data) {
	    var csv = $.csv.toObjects(data)
	    new Morris.Donut({
		// ID of the element in which to draw the chart.
		element: "chart-" + name,
		// Chart data records -- each entry in this array corresponds to a point on
		// the chart.
		data: csv,
	    })
	}
     });
}
