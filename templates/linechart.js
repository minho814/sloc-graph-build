module.exports = `
<div class="col-md-12" style="margin-bottom: 50px;">
  <h1>Source Code Metrics</h1>
  <form class="col-md-12">
  Languages to Count: <input [(ngModel)]="languageList" 
                             style="width: 30%; margin-bottom: 5px; margin-top: 5px"
                             placeholder="e.g. JavaScript, HTML, CSS"
                             class="form-control">
    <button type="button" class="btn btn-success" (click)="updateChart()">
      Generate Chart
    </button>
    <button type="button" class="btn btn-danger" (click)="randomizeColors()">
      Randomize Colors!
    </button>
  </form>

  <div class="center" *ngIf="chartCreated">

    <tabset>
      <tab heading="Chart">
        <div class="card card-block panel panel-default panel-body">
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
      </tab>
      <tab heading="Table">
        <div class="card card-block panel panel-default panel-body wrapper" style="margin-bottom: 10px;">
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
      </tab>
    </tabset>
      

    <div class="col-md-12">
      <h4>{{percentageValue}}</h4>
      <div class="btn-group">
        <label *ngFor="let label of lineChartLabels" 
               class="btn btn-primary" 
               [(ngModel)]="radioSelection" 
               btnRadio={{label}} 
               (click)="setPercentageValue(label)">
          {{label}}
        </label>
      </div>
    </div>

  </div>

</div>`