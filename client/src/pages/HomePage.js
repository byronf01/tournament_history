
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
          <div style={{height: '10%', textAlign: 'center', paddingTop: '2em'}}>
            <a href='https://github.com/byronf01/tournament_history' target="_blank" rel="noreferrer" >
              <img src='https://cdn-icons-png.flaticon.com/512/25/25231.png' style={{ height: '2.5em', width: 'auto'}}/>
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