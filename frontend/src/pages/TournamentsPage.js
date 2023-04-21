
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'

  
  class TournamentsPage extends Component {
    
    render() {
      
      return (
        <div>
            <Navbar />
            <p>Tournamnets</p>
        </div>
        
      )
    }
  }
  
  export { TournamentsPage };