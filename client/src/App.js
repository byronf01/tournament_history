import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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
    <Router>
      
      <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/tournaments" element={<TournamentsPage/>}/>
        <Route exact path="/matches" element={<MatchesPage/>}/>
        <Route exact path="/stats" element={<StatsPage/>}/>
        <Route exact path="*" element={<PageNotFound />}/>
      </Routes>
      
    </Router>
    
  );
}

export default App;
