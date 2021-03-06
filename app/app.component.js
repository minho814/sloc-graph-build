"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var common_2 = require('@angular/common');
var http_1 = require('@angular/http');
var ng2_charts_1 = require('ng2-charts/ng2-charts');
var ng2_bootstrap_1 = require('ng2-bootstrap/ng2-bootstrap');
var linechart = require('templates/linechart');
var AppComponent = (function () {
    function AppComponent(http) {
        this.http = http;
        // lineChart
        this.lineChartData = [
            { data: [], label: 'Loading...' },
        ];
        this.lineChartLabels = [''];
        this.lineChartOptions = {
            animation: false,
            responsive: true,
            scales: {
                xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Tags'
                        }
                    }],
                yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Source Lines of Code'
                        }
                    }]
            }
        };
        this.lineChartColours = [];
        this.lineChartLegend = true;
        this.lineChartType = 'line';
        this.chartCreated = false;
        this.linesCounted = false;
        this.radioSelection = "None";
        this.percentageValue = "No Percentage Change";
        //this.countLines();
    }
    AppComponent.prototype.randomizeColors = function () {
        var _lineChartColours = new Array(this.lineChartColours.length);
        for (var i = 0; i < this.lineChartColours.length; i++) {
            _lineChartColours[i] = this.formatLineColor(this.getRandomColor());
        }
        this.lineChartColours = _lineChartColours;
    };
    // ng2-charts functions
    AppComponent.prototype.rgba = function (colour, alpha) {
        return 'rgba(' + colour.concat(alpha).join(',') + ')';
    };
    AppComponent.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    AppComponent.prototype.getRandomColor = function () {
        return [this.getRandomInt(0, 255), this.getRandomInt(0, 255), this.getRandomInt(0, 255)];
    };
    AppComponent.prototype.formatLineColor = function (colors) {
        return {
            backgroundColor: this.rgba(colors, 1.0),
            borderColor: this.rgba(colors, 0.2),
            pointBackgroundColor: this.rgba(colors, 0.2),
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: this.rgba(colors, 0.8)
        };
    };
    // events
    AppComponent.prototype.chartClicked = function (e) {
        console.log(e);
    };
    AppComponent.prototype.chartHovered = function (e) {
        console.log(e);
    };
    AppComponent.prototype.updateChart = function () {
        if (this.linesCounted) {
            var languageArray = this.languageList.split(", ");
            for (var x = 0; x < this.clocArray.length; x++) {
                // Meanwhile, get the tags from clocArray and set lineChartLabels accordingly
                this.lineChartLabels[x] = this.clocArray[x].tag;
                languageArray.sort();
                // Create new lineChartData
                var _lineChartData = new Array(languageArray.length);
                // Run through each language in languageArray
                for (var i = 0; i < languageArray.length; i++) {
                    _lineChartData[i] = { data: new Array(this.clocArray.length), label: languageArray[i] };
                    // Run through each clocArray entry
                    for (var j = 0; j < this.clocArray.length; j++) {
                        // If language exists in the clocArray entry, save it in chart
                        if (_lineChartData[i].label in this.clocArray[j].stdout) {
                            _lineChartData[i].data[j] = (this.clocArray[j].stdout)[languageArray[i]].code;
                        }
                        else {
                            _lineChartData[i].data[j] = 0;
                        }
                    }
                    this.lineChartColours[i] = this.formatLineColor(this.getRandomColor());
                }
                // Update the line chart on the page
                this.lineChartData = _lineChartData;
            }
        }
        else {
            this.countLines();
        }
    };
    AppComponent.prototype.countLines = function () {
        var _this = this;
        this.chartCreated = true;
        var languageArray = this.languageList.split(", ");
        // Get the lines counted by countLines.js
        this.http.get("/countLines")
            .subscribe(function (data) {
            // Save the return value in a temporary array
            var tempArray = (data._body).split("SPLITMARK");
            // Remove first element (which is an empty string)
            if (tempArray.length > 1) {
                tempArray.shift();
            }
            else {
                console.log("Nothing returned from countLines");
                return;
            }
            // Create a new array of half the size and format the tempArray by stdout and tag
            _this.clocArray = new Array(tempArray.length / 2);
            for (var i = 0; i < tempArray.length / 2; i = i + 1) {
                if (tempArray[i * 2] == "") {
                    _this.clocArray[i] = { "stdout": "{}", "tag": tempArray[i * 2 + 1] };
                }
                else {
                    _this.clocArray[i] = { "stdout": tempArray[i * 2], "tag": tempArray[i * 2 + 1] };
                }
            }
            // Run through clocArray and parse each key in stdout, pushing unique ones to array
            for (var x = 0; x < _this.clocArray.length; x++) {
                _this.clocArray[x].stdout = JSON.parse(_this.clocArray[x].stdout);
                // Meanwhile, get the tags from clocArray and set lineChartLabels accordingly
                _this.lineChartLabels[x] = _this.clocArray[x].tag;
            }
            // Remove any instance of "header" and "SUM"
            if (languageArray.indexOf("header") != -1) {
                languageArray.splice(languageArray.indexOf("header"), 1);
            }
            if (languageArray.indexOf("SUM") != -1) {
                languageArray.splice(languageArray.indexOf("SUM"), 1);
            }
            languageArray.sort();
            // Create new lineChartData
            var _lineChartData = new Array(languageArray.length);
            // Run through each language in languageArray
            for (var i = 0; i < languageArray.length; i++) {
                _lineChartData[i] = { data: new Array(_this.clocArray.length), label: languageArray[i] };
                // Run through each clocArray entry
                for (var j = 0; j < _this.clocArray.length; j++) {
                    // If language exists in the clocArray entry, save it in chart
                    if (_lineChartData[i].label in _this.clocArray[j].stdout) {
                        _lineChartData[i].data[j] = (_this.clocArray[j].stdout)[languageArray[i]].code;
                    }
                    else {
                        _lineChartData[i].data[j] = 0;
                    }
                }
                _this.lineChartColours[i] = _this.formatLineColor(_this.getRandomColor());
            }
            // Update the line chart on the page
            _this.lineChartData = _lineChartData;
            _this.linesCounted = true;
        }, function (err) { return console.error(err); }, // on error
        function () { return console.log('Counting Lines Complete'); } // Callback
         // Callback
        );
    };
    AppComponent.prototype.setRadioSelection = function (value) {
        this.radioSelection = value;
    };
    AppComponent.prototype.setPercentageValue = function (value) {
        this.setRadioSelection(value);
        var sum = 0;
        var sum2 = 0;
        for (var x in this.lineChartData) {
            if (this.lineChartData[x].data[this.lineChartData[x].data.length - 1]) {
                sum = sum + this.lineChartData[x].data[this.lineChartData[x].data.length - 1];
            }
        }
        var index = -1;
        for (var x = 0; x < this.lineChartLabels.length; x++) {
            if (this.lineChartLabels[x] == this.radioSelection) {
                index = x;
            }
        }
        for (var x in this.lineChartData) {
            if (this.lineChartData[x].data[index]) {
                sum2 = sum2 + this.lineChartData[x].data[index];
            }
        }
        var result = ((sum - sum2) / sum) * 100;
        this.percentageValue = "Percent Change = " + (result.toFixed(2)) + "%";
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: linechart,
            directives: [ng2_charts_1.CHART_DIRECTIVES, common_1.NgClass, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, common_2.NgFor, common_2.NgIf, ng2_bootstrap_1.TAB_DIRECTIVES, ng2_bootstrap_1.BUTTON_DIRECTIVES],
            styles: ["\n  .wrapper {\n      overflow-x:scroll;\n    }\n  .center {\n      width: 90%;\n      margin-left: auto ;\n      margin-right: auto ;\n    }\n  "]
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map