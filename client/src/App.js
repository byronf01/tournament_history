import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { HomePage } from './pages/HomePage'
import { TournamentsPage } from './pages/TournamentsPage'
import { MatchesPage } from './pages/MatchesPage'
import { StatsPage } from './pages/StatsPage'
import { TournamentDetails } from './pages/TournamentDetails'
import { MatchDetails } from './pages/MatchDetails'
import Navbar from './components/Navbar'

function PageNotFound() {
  return (
    <div>
      <Navbar />
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
        <Route exact path="/tournaments/:id" element={<TournamentDetails/>}/>
        <Route exact path="/matches/:id1/:id2" element={<MatchDetails/>}/>
      </Routes>
      
    </Router>
    
  );
}

export default App;
