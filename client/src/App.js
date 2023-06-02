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

  document.body.style.background = 'linear-gradient(#576C83, #405590)'; // 'background: #617285;';
  document.body.style.minHeight = '100vh';
  document.body.style.display = 'flex';
  document.body.style.flexDirection = 'column';

  return (
    <Router>
      
      <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/tournaments" element={<TournamentsPage/>}/>
        <Route exact path="/matches" element={<MatchesPage/>}/>
        <Route exact path="/stats" element={<StatsPage/>}/>
        <Route exact path="*" element={<PageNotFound />}/>
        <Route exact path="/tournaments/:id" element={<TournamentDetails/>}/>
        <Route exact path="/matches/:acr/:mp" element={<MatchDetails/>}/>
      </Routes>
      
    </Router>
    
  );
}

export default App;
