import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class GeneralChart extends Component {
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
            this.setState({options: this.props.options})
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
}

export default GeneralChart;