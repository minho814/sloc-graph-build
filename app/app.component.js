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
            responsive: true
        };
        this.lineChartColours = [];
        this.lineChartLegend = true;
        this.lineChartType = 'line';
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
            backgroundColor: this.rgba(colors, 0.05),
            borderColor: this.rgba(colors, 1),
            pointBackgroundColor: this.rgba(colors, 1),
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
        var array = [];
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
                    if (array.indexOf(keyList[y]) == -1) {
                        array.push(keyList[y]);
                    }
                }
                // Meanwhile, get the tags from clocArray and set lineChartLabels accordingly
                _this.lineChartLabels[x] = clocArray[x].tag;
            }
            // Remove any instance of "header" and "SUM"
            if (array.indexOf("header") != -1) {
                array.splice(array.indexOf("header"), 1);
            }
            if (array.indexOf("SUM") != -1) {
                array.splice(array.indexOf("SUM"), 1);
            }
            // Create new lineChartData
            var _lineChartData = new Array(array.length);
            for (var i = 0; i < array.length; i++) {
                _lineChartData[i] = { data: new Array(clocArray.length), label: array[i] };
                for (var j = 0; j < clocArray.length; j++) {
                    if (_lineChartData[i].label in clocArray[j].stdout) {
                        _lineChartData[i].data[j] = (clocArray[j].stdout)[array[i]].code;
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