
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useEffect } from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'

  
function StatsPage () {
  
  useEffect ( () => {
        
    fetch('http://localhost:5000/api/stats').then( resp => resp.json())
        .then( (result) => {
        
           
            
        })
       

    }, []);

  
    
  return (
    <div>
        <Navbar />
        <p>Coming Soon</p>
    </div>
    
  )
  
}

export { StatsPage };