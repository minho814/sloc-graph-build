import {Component} from '@angular/core';

import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {NgFor, NgIf} from '@angular/common';
import {Http} from '@angular/http';

import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

let linechart = require('templates/linechart');

@Component({
  selector: 'my-app',
  template: linechart,
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES, NgFor, NgIf]
})

export class AppComponent {

  // lineChart
  public lineChartData: Array<any> = [
    { data: [], label: 'Loading...' },
  ];

  public lineChartLabels:Array<any> = [''];

  public lineChartOptions:any = {
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

  public lineChartColours:Array<any> = [];

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomizeColors():void {
    let _lineChartColours:Array<any> = new Array(this.lineChartColours.length);

    for (let i = 0; i < this.lineChartColours.length; i++) {
      _lineChartColours[i] = this.formatLineColor(this.getRandomColor());
    }

    this.lineChartColours = _lineChartColours;
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
      backgroundColor: this.rgba(colors, 1.0),
      borderColor: this.rgba(colors, 0.2),
      pointBackgroundColor: this.rgba(colors, 0.2),
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
    //this.countLines();
  }

  public languageList;
  public clocArray;

  public chartCreated: boolean = false;
  public linesCounted: boolean = false;

  public updateChart():void {
    if(this.linesCounted) {
      let languageArray: Array<any> = this.languageList.split(", ");

      for (let x = 0; x < this.clocArray.length; x++) {

        // Meanwhile, get the tags from clocArray and set lineChartLabels accordingly
        this.lineChartLabels[x] = this.clocArray[x].tag;

        languageArray.sort();

        // Create new lineChartData
        let _lineChartData: Array<any> = new Array(languageArray.length);

        // Run through each language in languageArray
        for (let i = 0; i < languageArray.length; i++) {

          _lineChartData[i] = { data: new Array(this.clocArray.length), label: languageArray[i] };

          // Run through each clocArray entry
          for (let j = 0; j < this.clocArray.length; j++) {

            // If language exists in the clocArray entry, save it in chart
            if (_lineChartData[i].label in this.clocArray[j].stdout) {
              _lineChartData[i].data[j] = (this.clocArray[j].stdout)[languageArray[i]].code;
            } else {
              _lineChartData[i].data[j] = 0;
            }
          }

          this.lineChartColours[i] = this.formatLineColor(this.getRandomColor());
        }

        // Update the line chart on the page
        this.lineChartData = _lineChartData;
      }

    } else {
      this.countLines();
    }
  }

  public countLines():void {
    this.chartCreated = true;

    let languageArray: Array<any> = this.languageList.split(", ");

    // Get the lines counted by countLines.js
    this.http.get("/countLines")
      .subscribe(
        (data: any) => 
          { 
            // Save the return value in a temporary array
            let tempArray:Array<any> = (data._body).split("SPLITMARK");
            
            // Remove first element (which is an empty string)
            if (tempArray.length > 1) {
              tempArray.shift();
            } else {
              console.log("Nothing returned from countLines");
              return;
            }

            // Create a new array of half the size and format the tempArray by stdout and tag
            this.clocArray = new Array(tempArray.length / 2);
            for (let i = 0; i < tempArray.length / 2; i = i+1) {
              if (tempArray[i * 2] == "") {
                this.clocArray[i] = { "stdout": "{}", "tag": tempArray[i * 2 + 1] };
              } else {
                this.clocArray[i] = { "stdout": tempArray[i * 2], "tag": tempArray[i * 2 + 1] };
              }
            }

            // Run through clocArray and parse each key in stdout, pushing unique ones to array
            for (let x = 0; x < this.clocArray.length; x++) {
              this.clocArray[x].stdout = JSON.parse(this.clocArray[x].stdout);
              
              // Meanwhile, get the tags from clocArray and set lineChartLabels accordingly
              this.lineChartLabels[x] = this.clocArray[x].tag;
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
            let _lineChartData: Array<any> = new Array(languageArray.length);

            // Run through each language in languageArray
            for (let i = 0; i < languageArray.length; i++) {

              _lineChartData[i] = { data: new Array(this.clocArray.length), label: languageArray[i] };

              // Run through each clocArray entry
              for (let j = 0; j < this.clocArray.length; j++) {

                // If language exists in the clocArray entry, save it in chart
                if (_lineChartData[i].label in this.clocArray[j].stdout) {
                  _lineChartData[i].data[j] = (this.clocArray[j].stdout)[languageArray[i]].code;
                } else {
                  _lineChartData[i].data[j] = 0;
                }
              }

              this.lineChartColours[i] = this.formatLineColor(this.getRandomColor());
            }

            // Update the line chart on the page
            this.lineChartData = _lineChartData;
            this.linesCounted = true;
          },

        err => console.error(err), // on error
        () => console.log('Counting Lines Complete') // Callback
      );
  }
  public radioSelection:string = "None";
  public setRadioSelection(value):void {
    this.radioSelection = value;
    this.setPercentageValue();
  }
  public percentageValue:string = "No Percentage Change"
  public setPercentageValue() {
    let sum = 0;
    let sum2 = 0;

    for (let x in this.lineChartData) {
      if (this.lineChartData[x].data[this.lineChartData[x].data.length - 1]) {
        sum = sum + this.lineChartData[x].data[this.lineChartData[x].data.length - 1];
      }
    }

    let index = -1;

    for (let x = 0; x < this.lineChartLabels.length; x++) {
      if(this.lineChartLabels[x] == this.radioSelection) {
        index = x; 
      }
    }

    for (let x in this.lineChartData) {
      if (this.lineChartData[x].data[index]) {
        sum2 = sum2 + this.lineChartData[x].data[index];
      }
    }

    let result = ( (sum - sum2) / sum ) * 100; 

    this.percentageValue = "Percent Change = " + (result.toFixed(2)) + "%";
  }

}