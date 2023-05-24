
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'
import BarChart from '../components/BarChart'
  
function StatsPage () {
  const [data, setData] = useState(false);
  
  useEffect ( () => {
        
    fetch('http://localhost:5000/api/stats').then( resp => resp.json())
        .then( (result) => {
          setData(result);  
        })
       

    }, []);

  
    
  return (
    <div>
        <Navbar />
        { data != false &&
          <div>
            {
              data['match_record'][0] >= data['match_record'][1] ? 
                <p>Lifetime Match Record <b>{data['match_record'][0]}</b> - {data['match_record'][1]}</p>
              : 
                <p>Lifetime Match Record {data['match_record'][0]} - <b>{data['match_record'][1]}</b></p>
            }
            {
              data['map_record'][0] >= data['map_record'][1] ? 
                <p>Lifetime Map Record <b>{data['map_record'][0]}</b> - {data['map_record'][1]}</p>
              : 
                <p>Lifetime Map Record {data['map_record'][0]} - <b>{data['map_record'][1]}</b></p>
            }
            <BarChart />
            
          </div>
        }
    </div>
    
  )
  
}

export { StatsPage };