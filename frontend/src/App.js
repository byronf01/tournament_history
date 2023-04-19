import tourn from './trophy.png';
import match from './match.png';
import stats from './stats.png';
import './App.css';
import {Routes, Route, useNavigate} from 'react-router-dom';

function Tag() {
  return (
    <div style={{
      margin: '0 auto',
      width: '60%',
      height: '18em',
      border: 'hidden',
    }}>
      <img src='https://a.ppy.sh/16626263?1677187336.png' style={{width: "20%", height: "auto"}}></img>
      <p style={{
        color: 'white',
        fontFamily: 'trebuchet ms',
        fontSize: '4em',
      }}>hiyah's Tournament History</p>
    </div>
  )
}

function HomeLine() {
  return (
    <hr style={{
      backgroundColor: '#dae4f0',
      width: '70%',
      height: '1em',
    }}/>
  )
}

function TournamentsButton() {
  return (
    <div>
      <button class="b1">
        Tournaments<br></br>
        <img src={tourn} alt="trophy" style={{width: "20%", height: "auto"}}></img>
      </button>
    </div>
  )
}

function MatchesButton() {
  return (
    <button class="b1">
      Matches<br></br>
      <img src={match} alt="matches" style={{width: "47%", height: "auto"}}></img>
    </button>
  )
}

function StatsButton() {
  return (
    <button class="b1">
      Stats<br></br>
      <img src={stats} alt="stats" style={{width: "23%", height: "auto"}}></img>
    </button>
  )
}

function Panel() {
  return (
    <div style={{ display: "flex", gap: "5%", padding: "10%", alignItems: "center", justifyContent: "center" }}>
      <TournamentsButton />
      <MatchesButton />
      <StatsButton />
    </div>
  )
}

function Tournaments() {
  return <h2>Home</h2>;
}

function App() {

  const navigate = useNavigate();
  
  document.body.style = 'background: #617285;';

  return (
    <div className="App">
      <div style={{height: '5em'}}></div>
      <Tag />
      <div style={{height: '8em'}}></div>
      <HomeLine />
      <Panel />

      <Routes>
        <Route exact path="/tournaments" element={<Tournaments/>}/>
      </Routes>
      
    </div>
    
  );
}

export default App;
