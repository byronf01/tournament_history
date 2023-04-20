import tourn from './trophy.png';
import match from './match.png';
import stats from './stats.png';
import './App.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React from 'react';
import {Component} from 'react';
import {Link} from "react-router-dom";

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

  function handleClick() {
    document.querySelectorAll('body > *').forEach(node => node.remove());
    window.location.href = '/tournaments';
  }

  return (
    <button class="b1" onClick={handleClick}>
      
      Tournaments<br></br>
      <img src={tourn} alt="trophy" style={{width: "20%", height: "auto"}}></img>
      
    </button>
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
    <div style={{ display: "flex", gap: "5%", padding: "5%", alignItems: "center", justifyContent: "center" }}>
      <TournamentsButton />
      <MatchesButton />
      <StatsButton />
    </div>
  )
}

class HomePageChild extends Component {
  render() {
    return (
      <span>
        <div style={{height: '5em'}}></div>
        <Tag />
        <div style={{height: '8em'}}></div>
        <HomeLine />
        <Panel />
      </span>
      
    )
  }
}

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {show: true};
  }

  componentWillUnmount() {
    this.setState({show: false});
    console.log(this.state)
  }
    
  render() {
    let myHomePage;
  
    return (
      <div>
        {this.state.show ? (
          <HomePageChild />
        ): (
          null
        )}
      </div>
    )
  }
}


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
