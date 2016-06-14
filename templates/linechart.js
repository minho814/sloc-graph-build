module.exports = `<div class="row">
	  <div class="col-md-6">
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
	  <div class="col-md-6" style="margin-bottom: 10px;">
	    <table class="table table-responsive table-condensed">
	      <tr>
	        <th *ngFor="let label of lineChartLabels">{{label}}</th>
	      </tr>
	      <tr *ngFor="let d of lineChartData">
	        <td *ngFor="let label of lineChartLabels; let j=index">{{d && d.data[j]}}</td>
	      </tr>
	    </table>
	    <button (click)="randomize()">CLICK</button>
	  </div>
</div>`