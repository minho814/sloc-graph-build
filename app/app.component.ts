import {Component} from '@angular/core';

import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {NgFor} from '@angular/common';
import {Http} from '@angular/http';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

let linechart = require('templates/linechart');

@Component({
  selector: 'my-app',
  template: linechart,
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES, NgFor]
})

export class AppComponent {

  // lineChart
  public lineChartData: Array<any> = [
    { data: [], label: 'Loading...' },
  ];

  public lineChartLabels:Array<any> = [''];

  public lineChartOptions:any = {
    animation: false,
    responsive: true
  };

  public lineChartColours:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.1)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.1)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.1)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = this.getRandomInt(1, 100);
      }
    }
    for (let i = 0; i < this.lineChartColours.length; i++) {
      this.lineChartColours[i] = this.formatLineColor(this.getRandomColor());
    }

    this.lineChartData = _lineChartData;
  }

  // ng2-charts functions
  public rgba(colour, alpha) {
    return 'rgba(' + colour.concat(alpha).join(',') + ')';
  }

  public getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getRandomColor() {
    return [this.getRandomInt(0, 255), this.getRandomInt(0, 255), this.getRandomInt(0, 255)];
  }

  public formatLineColor(colors) {
    return {
      backgroundColor: this.rgba(colors, 0.1),
      borderColor: this.rgba(colors, 1),
      pointBackgroundColor: this.rgba(colors, 1),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.rgba(colors, 0.8)
    };
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  
  constructor(public http: Http) {
    this.countLines();
  }

  public countLines():void {
    var array:Array<any> = [];
    this.http.get("/countLines")
      .subscribe(
        (data: any) => 
          { 
            let clocArray:Array<any> = (data._body).split("SPLITMARK");
            
            if (clocArray.length > 1) {
              clocArray.shift();
            }

            for (let x in clocArray) {
              let jsonObj = JSON.parse(clocArray[x]);
              let keyList = Object.keys(jsonObj); 
              for(let y in keyList) {
                if(array.indexOf(keyList[y]) == -1) {
                  array.push(keyList[y]);
                }
              }
            }
            
            if (array.indexOf("header") != -1) {
              array.splice(array.indexOf("header"), 1);
            } 
            if (array.indexOf("SUM") != -1) {
              array.splice(array.indexOf("SUM"), 1);
            } 

            let _lineChartData: Array<any> = new Array(array.length);
            for (let i = 0; i < array.length; i++) {
              _lineChartData[i] = { data: new Array(clocArray.length), label: array[i] };
              for (let j = 0; j < clocArray.length; j++) {
                _lineChartData[i].data[j] = this.getRandomInt(1, 100);
              }
            }
            for (let i = 0; i < array.length; i++) {
              this.lineChartColours[i] = this.formatLineColor(this.getRandomColor());
            }
            this.lineChartData = _lineChartData;
            this.lineChartLabels = new Array(clocArray.length).fill("temp");
          },

        err => console.error(err),
        () => console.log('Counting Lines Complete')
      );
  }
}