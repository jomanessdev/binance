
var _labels = [];
var _series = [];
var _subSeries = [];

var serverUrl = 'http://localhost:3000/services'

var lineChart = new Chartist.Line('#chart1', {
  labels: _labels,
  series: _series
});

var barChart = new Chartist.Bar('#chart2', {
  labels: _labels,
  series: _series
});

refresh();


function refresh(){

    var _labels = [];
    var _series = [];
    var _subSeries = [];

    var xmlhttp;

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
     } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } 

    xmlhttp.onreadystatechange = function() {        
        if (this.readyState == 4 && this.status == 200) {
            
           // Typical action to be performed when the document is ready:
           let jsonResp = JSON.parse(xmlhttp.responseText);

           _labels = jsonResp.labels;
           _series = jsonResp.series;
           _low = jsonResp.low;

           lineChart.update({series: _series, labels: _labels},{low: _low, showArea: true, showLine:true, showPoint:true});
           barChart.update({series: _series, labels: _labels},{low: _low});
        }
    };
    xmlhttp.open("GET", serverUrl+'/binance/all', true);
    xmlhttp.send();

}

