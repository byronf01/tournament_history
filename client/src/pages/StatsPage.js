
import './Pages.css';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'
import BarChart from '../components/BarChart'
import GeneralChart from '../components/GeneralChart'
import Spinner from '../components/Spinner'
import Dropdown from '../components/Dropdown'
import ScrollButton from '../components/ScrollButton';

const API_URL_LOCAL = 'http://localhost:5000/api/data';
const API_URL = 'https://tournament-history-9rmu-maxy7da5q-byronf01.vercel.app';

function Member(props) {
  const id = props.id;
  const username = props.username;
  const weight = props.weight;
  const pfp = `https://a.ppy.sh/${id}?1677187336.png`
  const profile = `https://osu.ppy.sh/users/${id}`;
  
  return (
      
        <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', gap: '1vw'}}>
            <a href={profile}>
                <img src={pfp} style={{width: `${weight}vw`, height: `${weight}vw`}} />
            </a>
            <p style={{fontSize: `${weight*0.3}vw`, flexGrow: 1}}><b>{username}</b></p>
        </div>
      
  )
}
  
function StatsPage () {
  const [data, setData] = useState(false);
  const [userOsuData, setUserOsuData] = useState(false);
  const [bannerList, setBannerList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanners, setShowBanners] = useState(false);
  const [loadingTimeExpired, setLoadingTimeExpired] = useState(false);
  
  useEffect ( () => {
    let timer;

    fetch(`${API_URL}/api/stats`).then( resp => resp.json())
        .then( (result) => {
          setData(result);  
          setIsLoading(false);
          // add banners
          let banners = [];
          for (let b in result['banners_won']) {
            
            banners.push(
              <div style={{display: 'flex', justifyContent: 'center', paddingBottom: '2vw'}}>
                <img src={result['banners_won'][b]} style={{maxWidth: '50vw', maxHeight: '20vw'}}/>
              </div>
            )
          }
          setBannerList(banners)

          let ids = [];
          for (let i in result['most_teamed']) {
            ids.push(result['most_teamed'][i][0]);
          }

          // 2nd fetch for usernames for most teamed teammates
          fetch(`${API_URL}/api/name`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(ids)
          }).then( resp2 => resp2.json()).then( (res2) => {
              setUserOsuData(res2)
              clearTimeout(timer);
          })

        })

      timer = setTimeout(() => {
        setLoadingTimeExpired(true);
      }, 20000);
    
      return () => clearTimeout(timer);
    }, []);

    const placementOptions = (data == false ? null : {
			title: {
				text: "Summary of placements"
			},
      theme: "light2",
			data: [
			{
				type: "column",
				dataPoints: [
					{ label: "1st Place",  y: data['placements']["1"]  },
					{ label: "2nd Place", y: data['placements']["2"]  },
					{ label: "3rd Place", y: data['placements']["3"]  },
					{ label: "Finals",  y: data['placements']["4"]  },
					{ label: "Semifinals",  y: data['placements']["5"]  },
          { label: "Quarterfinals", y: data['placements']["6"]  },
					{ label: "Round of 16",  y: data['placements']["7"]  },
					{ label: "Round of 32",  y: data['placements']["8"]  },
          { label: "Round of 64",  y: data['placements']["9"]  },
					{ label: "Round of 128",  y: data['placements']["10"]  },
          { label: "DNQ",  y: data['placements']["11"]  }
				]
			}
			]
		})

    const mostPlayedModsOptions = (data == false ? null : {
      animationEnabled: true,
			title: {
				text: "Most Played Mods (by %)"
			},
      theme: "light2",
			data: [
			{
				type: "pie",
				indexLabel: "{label}: {y}%",		
				startAngle: -90,
        dataPoints: Object.entries(data['most_played_mods']).map(([label, y]) => ({ label, y: (y * 100).toFixed(3) }))
			}
			]
		})
  
  const most_teamed = (data == false || userOsuData == false ? null : 
                      data['most_teamed'].map((member) => 
                        
                      <div style={{display: 'flex', gap: '1vw', paddingBottom: '1vw'}}>
                        <p style={{fontSize: `${member[1]*0.3}vw`}}>{member[1]}</p>
                        <Member id={member[0]} username={userOsuData[member[0]]} weight={member[1]} />
                      </div>).slice(0, 10))

const wrbyModOptions = (data == false ? null : {
  title: {
    text: "Win Rate by Mod (by %)"
  },
  theme: "light2",
  data: [
  {
    type: "column",
    dataPoints: Object.entries(data['win_rate_per_mod']).map(([label, y]) => ({ label, y: Number((y*100).toFixed(2)) })).sort((a, b) => {
      if (a['y'] < b['y']) return 1;
      else if (a['y'] > b['y']) return -1;
      else return 0;
    })
  }
  ]
  })

  const avgScoreByModOptions = (data == false ? null : {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Average Score Per Mod, Standardized"
    },
    axisX: {
      title: "Score",
      reversed: true,
    },
    axisY: {
      title: "Mods",
      includeZero: true,
      labelFormatter: (e) => { return e.value.toLocaleString("en-US") }
    },
    
    data: [{
      type: "bar",
      dataPoints: Object.entries(data['avg_score_per_mod']).map(([label, y]) => ({ label, y: Number(y.toFixed(0)) })).sort((a, b) => {
      if (a['y'] < b['y']) return 1;
      else if (a['y'] > b['y']) return -1;
      else return 0;
    })}]
  })

  const mostCommonTeamSizeOptions = (data == false ? null : {
    title: {
      text: "Most Common Team Size"
    },
    theme: "light2",
    data: [
    {
      type: "column",
      dataPoints: Object.entries(data['most_common_team_size'])
        .map(([label, y]) => ({ label: (label == 'other'? 'other' : `Teams of ${label}`), y }))
    }
    ]
  })

  const mostCommonFormatOptions = (data == false ? null : {
    title: {
      text: "Most Common Format"
    },
    theme: "light2",
    data: [
    {
      type: "column",
      dataPoints: Object.entries(data['most_common_format'])
        .map(([label, y]) => ({ label: (label == 'other'? 'other' : `${label}v${label}`), y }))
    }
    ]
  })

  const tournsOverTimeOptions = (data == false ? null : {
    title: {
      text: "Tournaments Over Time"
    },
    theme: "light2",
    data: [
    {
      type: "line",
      dataPoints: Object.entries(data['tourns_over_time']).flatMap(([year, arr]) => {
        if (year == Math.max(...Object.keys(data['tourns_over_time']).map( (k) => (parseInt(k)) ))) {
          // Cut off trailing zeros
          let lastZero = 11;
          while (arr[lastZero] == 0) {
            lastZero -= 1;
          }
          arr = arr.slice(0, lastZero + 1);
        }
        return arr.map((value, index) => ({ label: `${year}-${index + 1}`, y: value }));
      })
    }
    ],
  })

  const bestMCOptions = (data == false ? null : {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Best Tournament Performances"
    },
    axisX:{
      reversed:  true
    },
    axisY: {
      title: "Average Match Cost",
      includeZero: true,
    },
    data: [{
      type: "bar",
      dataPoints: data['avg_mc_per_tourn'].map(([label, y]) => ({ label, y: Number(y.toFixed(3)) })).slice(0, 10)
    }]
  })
  
  const worstMCOptions = (data == false ? null : {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Worst Tournament Performances"
    },
    axisX:{
      reversed:  true
    },
    axisY: {
      title: "Average Match Cost",
      includeZero: true,
    },
    data: [{
      type: "bar",
      dataPoints: data['avg_mc_per_tourn'].map(([label, y]) => ({ label, y: Number(y.toFixed(3)) })).slice(-11, -1)
    }]
  })
    
  return (
    <div>
        <Navbar />
        <div style={{paddingLeft: "10%", 
                paddingRight: "10%"}}>
                <div>
                <h1 style={{textAlign: "center", 
                fontSize: "3.5vw",
                fontFamily: 'trebuchet ms',
                textShadow: '3px 3px #505F74',
                color: "rgb(255,255,255)"}}>🥇Stats🥇</h1>
                </div>
            </div>
        {isLoading && <Spinner />}
        <ScrollButton />
        {isLoading && loadingTimeExpired && <p style={{textAlign: 'center', fontSize: '1.2vw'}}>Api failure, try again later</p>}
        { data != false &&
          <div style={{fontFamily: 'trebuchet ms', color: '#FFFFFF'}}>
            

            <div className='margin2' style={{ display: 'flex', width: '70%' }}>
              <div style={{ width: '57%', paddingRight: '6%' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <BarChart options={avgScoreByModOptions} containerProps={{ height: '30vw' }} />
                  </div>
                </div>
              </div>
              <div style={{ width: '37%', display: 'flex', flexDirection: 'column' }}>
                <div>
                  <GeneralChart options={wrbyModOptions} containerProps={{height: '20vw'}}/>
                </div>
                <div >
                  <p style={{ textAlign: 'center', fontSize: '1.6vw', marginTop: '2vw', marginBottom: '0.8vw' }}>Average matches per Tournament:</p>
                  <p style={{ textAlign: 'center', fontSize: '3vw', marginTop: '0' }}>{(Math.round(data['avg_matches_per_tourn'] * 100) / 100).toFixed(3)}</p>
                </div>
              </div>
            </div>

            <div className='margin2' style={{ display: 'flex', marginTop: '3vw', width: '70%' }}>
              <div style={{ width: '27%', paddingRight: '6%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
                  <div>
                    <p style={{fontSize: '1.8vw', marginTop: '0.3vw', marginBottom: '0.8vw'}}>Lifetime Match Record: </p>
                    {
                      data['match_record'][0] >= data['match_record'][1] ? 
                        <div style={{fontSize: '2.5vw', lineHeight: '2.2vw'}}><b style={{fontSize: '2.7vw'}}>(W) {data['match_record'][0]}</b><br /> - <br/><p style={{fontSize: '2vw', marginTop: '0'}}>(L) {data['match_record'][1]}</p></div>
                      : 
                        <div style={{fontSize: '2.5vw'}}><p style={{fontSize: '2vw', marginTop: '0'}}>(W) {data['match_record'][0]}</p><br /> - <br /><b style={{fontSize: '2.7vw'}}>(L) {data['match_record'][1]}</b></div>
                    }
                    <p style={{fontSize: '1.8vw', marginTop: '0.3vw', marginBottom: '0.8vw'}}>Lifetime Map Record: </p>
                    {
                      data['map_record'][0] >= data['map_record'][1] ? 
                        <div style={{fontSize: '2.5vw', lineHeight: '2.2vw'}}><b style={{fontSize: '2.7vw'}}>(W) {data['map_record'][0]}</b><br /> - <br /><p style={{fontSize: '2vw', marginTop: '0'}}>(L) {data['map_record'][1]}</p></div>
                      : 
                        <div style={{fontSize: '2.5vw'}}><p style={{fontSize: '2vw', marginTop: '0'}}>(W) {data['map_record'][0]}</p><br /> - <br /><b style={{fontSize: '2.7vw'}}>(L) {data['map_record'][1]}</b></div>
                    }
                    
                  </div>
                </div>
              </div>
              <div style={{ width: '64%', display: 'flex', flexDirection: 'column' }}>
                <div>
                  <GeneralChart options={tournsOverTimeOptions}/>
                </div>
                
              </div>
            </div>

            <div className='margin' style={{ display: 'flex', marginTop: '3vw', width: '80%', justifyContent: 'center' }}>
              <div style={{ width: '58%', paddingRight: '6%' }}>
                  <div>
                    <GeneralChart options={mostCommonTeamSizeOptions}/>
                  </div>
              </div>
              <div style={{ width: '34%', display: 'flex', flexDirection: 'column' }}>
                  <GeneralChart options={mostCommonFormatOptions}/>
              </div>
            </div>

            <div className='margin' style={{ display: 'flex', paddingLeft: '2%', marginTop: '3vw', width: '80%', justifyContent: 'center' }}>
              <div style={{ width: '38%', paddingRight: '4%' }}>
                <GeneralChart options={mostPlayedModsOptions}/>
              </div>
              <div style={{width: "56%", margin: "0"}}>
                <GeneralChart options={placementOptions}/>
              </div>
            </div>
            
            <div className='margin' style={{display: 'flex', marginTop: '3vw', flexDirection: 'row'}}>

              <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
                <div className='margin3' style={{  marginTop: '3vw'}}>
                  <BarChart options={bestMCOptions}/>
                </div>
                
                <div className='margin3' style={{marginTop: '3vw'}}>
                  <BarChart options={worstMCOptions}/>
                </div>
              </div>

              <div className='margin3' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '30%', textAlign: 'center'}}>
                
                <p style={{margin: '0', marginBottom: '1.4vw', fontSize: '2vw'}}>Most Teamed: </p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <ul style={{padding: '0', display: "flex", flexDirection: 'column'}}>{most_teamed}</ul>
                </div> 
              </div>
            </div>
            
            <div>
              <Dropdown showBanners={showBanners} setShowBanners={() => {setShowBanners(!showBanners) }} banners={bannerList} />
            </div>
            
            {/*extra space at end of page*/}
            <div style={{height: '5vh'}}></div>
            
          </div>
        }
    </div>
    
  )
  
}

export { StatsPage };