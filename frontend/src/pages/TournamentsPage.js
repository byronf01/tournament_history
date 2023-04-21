
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
        <div style={{paddingLeft: "10%", 
            paddingRight: "10%"}}>
            <div>
            <h1 style={{textAlign: "center", 
            fontSize: "50px",
            color: "rgb(255,255,255)"}}>🏆 Tournaments 🏆</h1>
            </div>
        </div>
        
        
    </div>
    
    )
}
}
  
export { TournamentsPage };