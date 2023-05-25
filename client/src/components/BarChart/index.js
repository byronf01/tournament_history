import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class BarChart extends Component {
	constructor() {
		super();
		this.state = {
			options: {
				animationEnabled: true,
				theme: "light2",
				title:{
					text: "Most Popular Social Networking Sites"
				},
				axisX: {
					title: "Social Network",
					reversed: true,
				},
				axisY: {
					title: "Monthly Active Users",
					includeZero: true,
					labelFormatter: this.addSymbols
				},
				data: [{
					type: "bar",
					dataPoints: [
						{ y:  2200000000, label: "Facebook" },
						{ y:  1800000000, label: "YouTube" },
						{ y:  800000000, label: "Instagram" },
						{ y:  563000000, label: "Qzone" },
						{ y:  376000000, label: "Weibo" },
						{ y:  336000000, label: "Twitter" },
						{ y:  330000000, label: "Reddit" }
					]
				}]
			}
		}
	}
	
	componentDidMount() {
        if (this.props.options) {
            this.setState({options: this.props.options})
        }
    }
	render() {
		
		return (
		<div>
			<CanvasJSChart options = {this.state.options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
	addSymbols(e){
		var suffixes = ["", "K", "M", "B"];
		var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
		if(order > suffixes.length - 1)
			order = suffixes.length - 1;
		var suffix = suffixes[order];
		return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
	}
}

export default BarChart;