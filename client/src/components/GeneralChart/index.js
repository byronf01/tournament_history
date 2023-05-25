import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class GeneralChart extends Component {
    constructor() {
        super();
        this.state = {
            options: {
                title: {
                    text: "Basic Column Chart"
                },
                data: [
                {
                    // Change type to "doughnut", "line", "splineArea", etc.
                    type: "column",
                    dataPoints: [
                        { label: "Apple",  y: 10  },
                        { label: "Orange", y: 15  },
                        { label: "Banana", y: 25  },
                        { label: "Mango",  y: 30  },
                        { label: "Grape",  y: 28  }
                    ]
                }
                ]
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
}

export default GeneralChart;