
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