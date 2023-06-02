import tourn from '../assets/trophy.png';
import match from '../assets/match.png';
import stats from '../assets/stats.png';

function TournamentsButton() {
  
    function handleClick() {
      document.querySelectorAll('body > *').forEach(node => node.remove());
      window.location.href = '/tournaments';
    }
  
    return (
      <button class="b1" onClick={handleClick} style={{width: '18rem', height: '10rem'}}>
        <p style={{marginTop: "4%", marginBottom: "0%",}}>Tournaments</p>
        <p style={{marginTop: "4%", marginBottom: "6%"}}>🏆</p>
      </button>
    )
  }
  
  function MatchesButton() {

    function handleClick() {
      document.querySelectorAll('body > *').forEach(node => node.remove());
      window.location.href = '/matches';
    }

    return (
      <button class="b1" onClick={handleClick} style={{width: '18rem', height: '10rem'}}>
        <p style={{marginTop: "4%", marginBottom: "0%"}}>Matches</p>
        <p style={{marginTop: "4%", marginBottom: "6%"}}>🆚</p>
      </button>
    )
  }
  
  function StatsButton() {

    function handleClick() {
      document.querySelectorAll('body > *').forEach(node => node.remove());
      window.location.href = '/stats';
    }

    return (
      <button class="b1" onClick={handleClick} style={{width: '18rem', height: '10rem'}}>
        <p style={{marginTop: "4%", marginBottom: "0%"}}>Stats</p>
        <p style={{marginTop: "4%", marginBottom: "6%"}}>🥇</p>
      </button>
    )
  }
  
  function Panel() {
    return (
      <div class='outer-wrapper' style={{display: 'flex', width: '100%', height: 'auto', flexWrap: 'wrap', paddingTop: "2.5%", marginLeft: "0%", marginRight: "0px", justifyContent: "center"}}>
        <div style={{width: '80%', display: "flex", gap: "6%", flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap', justifyContent: "center" }}>
          <TournamentsButton />
          <MatchesButton />
          <StatsButton />
        </div>
      </div>
      
    )
  }
  
  export { Panel };