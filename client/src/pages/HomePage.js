
import './HomePage.css';
import React from 'react';
import { Component } from 'react';
import { Panel } from '../components/Panel.js'
import { Tag } from '../components/Tag.js'

  class HomePageChild extends Component {
    render() {
      return (
        <span>
          <div style={{height: '5em'}}></div>
          <Tag />
          <Panel />
        </span>
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
      let myHomePage;
    
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