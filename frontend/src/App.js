import tourn from './trophy.png';
import match from './match.png';
import stats from './stats.png';
import './App.css';

function Tag() {
  return (
    <div style={{
      margin: '0 auto',
      width: '60%',
      height: '18em',
      border: 'hidden',
    }}>
      <img src='https://a.ppy.sh/16626263?1677187336.png' class="responsive1"></img>
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
    <button class="b1">
      Tournaments<br></br>
      <img src={tourn} alt="trophy" class="responsive1"></img>
    </button>
  )
}

function MatchesButton() {
  return (
    <button class="b2">
      Matches<br></br>
      <img src={match} alt="matches" class="responsive2"></img>
    </button>
  )
}

function StatsButton() {
  return (
    <button class="b3">
      Stats<br></br>
      <img src={stats} alt="stats" class="responsive3"></img>
    </button>
  )
}

function Panel() {
  return (
    <div class="buttons">

      <div class="action">
        <div id="something">

          <TournamentsButton />
          <span></span>
          <MatchesButton />
          <span></span>
          <StatsButton />

        </div>
      

      </div>

    </div>
  )
}

function App() {
  document.body.style = 'background: #617285;';
  return (
    <div className="App">
      <div style={{height: '3pm'}}></div>
      <Tag />
      <div style={{height: '8em'}}></div>
      <HomeLine />
      <div style={{height: '3em'}}></div>
      <Panel />
    </div>
    
  );
}

export default App;
