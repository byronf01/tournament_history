
import './Pages.css';
import React from 'react';
import { Component } from 'react';
import Panel from '../components/Panel'
import Tag from '../components/Tag'

  class HomePageChild extends Component {
    render() {
      return (
        <div>
          <Tag />
          <Panel />
          
          <div style={{position: 'absolute', bottom: 0, right: 0}}>
            <a href="https://info.flagcounter.com/xOdr" target="_blank" rel="noreferrer">
              <img src="https://s11.flagcounter.com/count/xOdr/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_20/viewers_0/labels_1/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"
              style={{maxWidth: '100px', maxHeight: '200px'}} />
            </a>
          </div>
          
        </div>
      )
    }
  }
  
  class HomePage extends Component {
    constructor(props) {
      super(props);
      this.state = {show: true};
    }
  
    componentWillUnmount() {
      this.setState({show: false});
    }
      
    render() {
    
      return (
        <div>
          {this.state.show ? (
            <HomePageChild />
          ): (
            null
          )}
        </div>
      )
    }
  }
  
  export { HomePage };