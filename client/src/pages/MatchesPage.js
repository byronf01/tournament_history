
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'

  
  class MatchesPage extends Component {
    
    render() {
      
      return (
        <div>
          <Navbar />
          <p>Coming Soon</p>
        </div>
        
      )
    }
  }
  
  export { MatchesPage };