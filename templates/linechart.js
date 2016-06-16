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
	      	<th></th>
	        <th *ngFor="let label of lineChartLabels">{{label}}</th>
	      </tr>
	      <tr *ngFor="let d of lineChartData; let i=index">
	      	<th>{{lineChartData[i].label}}</th>
	        <td *ngFor="let label of lineChartLabels; let j=index">{{d && d.data[j]}}</td>
	      </tr>
	    </table>
	    <button (click)="randomizeColors()">Randomize Colors!</button>
	  </div>
	  <div class="form-group">
		  <label class="col-md-4 control-label" for="radios">{{percentageValue}}</label>
		  <div class="col-md-4"> 
		    <label class="radio-inline" *ngFor="let label of lineChartLabels" >
		      <input type="radio" name="radios" value="{{label}}" (click)="setRadioSelection(label)">
		      {{label}}
		    </label>
		  </div>
		</div>
</div>`