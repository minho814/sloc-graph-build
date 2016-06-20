module.exports = `
<h1>Source Code Metrics</h1>

<form class="col-md-8">
Languages to Count: <input [(ngModel)]="languageList" size="50%"
                     placeholder="e.g. JavaScript, HTML, CSS">
<button (click)="updateChart()">Generate Chart</button>
</form>

<div class="row center" *ngIf="chartCreated">
<div class="col-md-10 card card-block panel panel-default panel-body">
  <div class="col-md-10">
    <div style="padding-bottom: 20px;">
      <base-chart class="chart" 
                  [datasets]="lineChartData"
                  [labels]="lineChartLabels"
                  [options]="lineChartOptions"
                  [colors]="lineChartColours"
                  [legend]="lineChartLegend"
                  [chartType]="lineChartType"
                  (chartHover)="chartHovered($event)"
                  (chartClick)="chartClicked($event)"></base-chart>
    </div>
  </div>
  <div class="col-md-12 wrapper" style="margin-bottom: 10px;">
    <table class="table table-responsive table-condensed">
      <tr>
        <th></th>
        <th *ngFor="let label of lineChartLabels">{{label}}</th>
      </tr>
      <tr *ngFor="let d of lineChartData; let i=index">
        <th>{{lineChartData[i].label}}</th>
        <td *ngFor="let label of lineChartLabels; let j=index">{{d && d.data[j]}}</td>
      </tr>
    </table>
  </div>
</div>
  <div class="col-md-12" style="margin-bottom: 10px;">
    <button (click)="randomizeColors()">Randomize Colors!</button>
  </div>
  <div class="form-group">
    <div class="col-md-8"> 
      <label>{{percentageValue}}</label>
      <br>
      <label *ngFor="let label of lineChartLabels" >
        <input type="radio" name="radios" value="{{label}}" (click)="setRadioSelection(label)">
          {{label}} &nbsp;
      </label>
    </div>
  </div>
</div>`