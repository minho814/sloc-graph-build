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
        this.radioSelection = "None";
        this.percentageValue = "No Percentage Change";
        this.countLines();
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
    AppComponent.prototype.countLines = function () {
        var _this = this;
        var languageArray = [];
        // Get the lines counted by countLines.js
        this.http.get("/countLines")
            .subscribe(function (data) {
            // Save the return value in a temporary array
            var tempArray = (data._body).split("SPLITMARK");
            // Remove first element (which is an empty string)
            if (tempArray.length > 1) {
                tempArray.shift();
            }
            // Create a new array of half the size and format the tempArray by stdout and tag
            var clocArray = new Array(tempArray.length / 2);
            for (var i = 0; i < tempArray.length / 2; i = i + 1) {
                clocArray[i] = { "stdout": tempArray[i * 2], "tag": tempArray[i * 2 + 1] };
            }
            // Run through clocArray and parse each key in stdout, pushing unique ones to array
            for (var x = 0; x < clocArray.length; x++) {
                clocArray[x].stdout = JSON.parse(clocArray[x].stdout);
                var keyList = Object.keys(clocArray[x].stdout);
                for (var y in keyList) {
                    if (languageArray.indexOf(keyList[y]) == -1) {
                        languageArray.push(keyList[y]);
                    }
                }
                // Meanwhile, get the tags from clocArray and set lineChartLabels accordingly
                _this.lineChartLabels[x] = clocArray[x].tag;
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
                _lineChartData[i] = { data: new Array(clocArray.length), label: languageArray[i] };
                // Run through each clocArray entry
                for (var j = 0; j < clocArray.length; j++) {
                    // If language exists in the clocArray entry, save it in chart
                    if (_lineChartData[i].label in clocArray[j].stdout) {
                        _lineChartData[i].data[j] = (clocArray[j].stdout)[languageArray[i]].code;
                    }
                    else {
                        _lineChartData[i].data[j] = null;
                    }
                }
                _this.lineChartColours[i] = _this.formatLineColor(_this.getRandomColor());
            }
            // Update the line chart on the page
            _this.lineChartData = _lineChartData;
        }, function (err) { return console.error(err); }, // on error
        function () { return console.log('Counting Lines Complete'); } // Callback
         // Callback
        );
    };
    AppComponent.prototype.setRadioSelection = function (value) {
        this.radioSelection = value;
        this.setPercentageValue();
    };
    AppComponent.prototype.setPercentageValue = function () {
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
            directives: [ng2_charts_1.CHART_DIRECTIVES, common_1.NgClass, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, common_2.NgFor]
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map