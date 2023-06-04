import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class BarChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  options: props.options,
		  containerProps: props.containerProps,
		};
	  }
	
	/*
	componentDidMount() {
        if (this.props.options) {
            this.setState({options: this.props.options, containerProps: this.props.containerProps})
        }
    }

	componentDidUpdate(prevProps) {
		if (prevProps.containerProps !== this.props.containerProps) {
		  this.updateContainerProps();
		}
	  }
	
	  updateContainerProps() {
		if (this.props.options) {
		  this.setState({
			options: this.props.options,
			containerProps: this.props.containerProps,
		  });
		}
	  }

	*/

	render() {
		
		return (
		<div>
			<CanvasJSChart options = {this.state.options} containerProps={this.state.containerProps}
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