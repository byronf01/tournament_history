import './App.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React from 'react';
import {Component} from 'react';
import {Link} from "react-router-dom";
import { HomePage } from './pages/HomePage'


function Tournaments() {
  return <h2>Home</h2>;
}

function App() {

  document.body.style = 'background: #617285;';

  return (
    <div className="App">
      
      <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/tournaments" element={<Tournaments/>}/>
      </Routes>
      
    </div>
    
  );
}

export default App;
