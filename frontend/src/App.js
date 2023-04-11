import logo from './logo.svg';
import tourn from './trophy.png';
import './App.css';

function Tag() {
  return (
    <div style={{
      margin: '0 auto',
      width: '60%',
      height: '18em',
      border: 'hidden',
    }}>
      <img src='https://a.ppy.sh/16626263?1677187336.png' class="responsive"></img>
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
      <img src={tourn} alt="trophy" class="responsive"></img>
    </button>
  )
}

function App() {
  document.body.style = 'background: #617285;';
  return (
    <div className="App">
      <div style={{height: '100px'}}></div>
      <Tag />
      <div style={{height: '120px'}}></div>
      <HomeLine />
      <TournamentsButton />
    </div>
    
  );
}

export default App;
