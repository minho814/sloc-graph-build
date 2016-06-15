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
    AppComponent.prototype.randomize = function () {
        var _lineChartData = new Array(this.lineChartData.length);
        for (var i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
            for (var j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = this.getRandomInt(1, 100);
            }
        }
        for (var i = 0; i < this.lineChartColours.length; i++) {
            this.lineChartColours[i] = this.formatLineColor(this.getRandomColor());
        }
        this.lineChartData = _lineChartData;
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
        this.http.get("/countLines")
            .subscribe(function (data) {
            var tempArray = (data._body).split("SPLITMARK");
            if (tempArray.length > 1) {
                tempArray.shift();
            }
            var clocArray = new Array(tempArray.length / 2);
            for (var i = 0; i < tempArray.length / 2; i = i + 1) {
                clocArray[i] = { "stdout": tempArray[i * 2], "tag": tempArray[i * 2 + 1] };
            }
            for (var x = 0; x < clocArray.length; x++) {
                var jsonObj = JSON.parse(clocArray[x].stdout);
                var keyList = Object.keys(jsonObj);
                for (var y in keyList) {
                    if (array.indexOf(keyList[y]) == -1) {
                        array.push(keyList[y]);
                    }
                }
                _this.lineChartLabels[x] = clocArray[x].tag;
            }
            if (array.indexOf("header") != -1) {
                array.splice(array.indexOf("header"), 1);
            }
            if (array.indexOf("SUM") != -1) {
                array.splice(array.indexOf("SUM"), 1);
            }
            var _lineChartData = new Array(array.length);
            for (var i = 0; i < array.length; i++) {
                _lineChartData[i] = { data: new Array(clocArray.length), label: array[i] };
                for (var j = 0; j < clocArray.length; j++) {
                    _lineChartData[i].data[j] = _this.getRandomInt(1, 100);
                }
                _this.lineChartColours[i] = _this.formatLineColor(_this.getRandomColor());
            }
            _this.lineChartData = _lineChartData;
        }, function (err) { return console.error(err); }, function () { return console.log('Counting Lines Complete'); });
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