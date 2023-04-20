import './App.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React from 'react';
import { HomePage } from './pages/HomePage'
import { TournamentsPage } from './pages/TournamentsPage'
import { MatchesPage } from './pages/MatchesPage'
import { StatsPage } from './pages/StatsPage'

function PageNotFound() {
  return (
    <div>
      <p>404 Page not found</p>
    </div>
  )
}

function App() {

  document.body.style = 'background: #617285;';

  return (
    <div className="App">
      
      <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/tournaments" element={<TournamentsPage/>}/>
        <Route exact path="/matches" element={<MatchesPage/>}/>
        <Route exact path="/stats" element={<StatsPage/>}/>
        <Route exact path="*" element={<PageNotFound />}/>
      </Routes>
      
    </div>
    
  );
}

export default App;
