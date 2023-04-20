import tourn from '../assets/trophy.png';
import match from '../assets/match.png';
import stats from '../assets/stats.png';

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
  
  export { Panel };