import './Panel.css'

function TournamentsButton() {
  
    function handleClick() {
      document.querySelectorAll('body > *').forEach(node => node.remove());
      window.location.href = '/tournaments';
    }
  
    return (
      <button class="b1 panel-button" onClick={handleClick} >
        <div >
          <p style={{marginTop: "4%", marginBottom: "0%",}}>Tournaments</p>
          <p style={{marginTop: "4%", marginBottom: "6%"}}>🏆</p>
        </div>
        
      </button>
    )
  }
  
  function MatchesButton() {

    function handleClick() {
      document.querySelectorAll('body > *').forEach(node => node.remove());
      window.location.href = '/matches';
    }

    return (
      <button class="b1 panel-button" onClick={handleClick} >
        <div>
          <p style={{marginTop: "4%", marginBottom: "0%"}}>Matches</p>
          <p style={{marginTop: "4%", marginBottom: "6%"}}>🆚</p>
        </div>
      </button>
    )
  }
  
  function StatsButton() {

    function handleClick() {
      document.querySelectorAll('body > *').forEach(node => node.remove());
      window.location.href = '/stats';
    }

    return (
      <button class="b1 panel-button" onClick={handleClick} >
        <div>
          <p style={{marginTop: "4%", marginBottom: "0%"}}>Stats</p>
          <p style={{marginTop: "4%", marginBottom: "6%"}}>🥇</p>
        </div>
      </button>
    )
  }
  
  function Panel() {
    return (
      <div style={{display: 'flex', width: '100%', height: 'auto', flexWrap: 'wrap', paddingTop: "2.5%", marginLeft: "0", marginRight: "0", justifyContent: "center"}}>
        <div style={{width: '80%', display: "flex", gridGap: '5vw', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap', justifyContent: "center" }}>
          <TournamentsButton />
          <MatchesButton />
          <StatsButton />
        </div>
      </div>
      
    )
  }
  
  export default Panel;