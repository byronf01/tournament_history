
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'
import BarChart from '../components/BarChart'
import GeneralChart from '../components/GeneralChart'
import Teammates from '../components/Teammates.js'

function Member(props) {
  const id = props.id;
  const username = props.username;
  const pfp = `https://a.ppy.sh/${id}?1677187336.png`
  const profile = `https://osu.ppy.sh/users/${id}`;
  
  return (
      <div style={{display: "inline", marginRight: "10px"}}>
          <a href={profile}>
              <img src={pfp} style={{width: "6em", height: "6em"}} />
          </a>
          <p><b>{username}</b></p>
      </div>
  )
}
  
function StatsPage () {
  const [data, setData] = useState(false);
  const [userOsuData, setUserOsuData] = useState(false)
  const [bannerList, setBannerList] = useState(false)
  
  useEffect ( () => {
        
    fetch('http://localhost:5000/api/stats').then( resp => resp.json())
        .then( (result) => {
          setData(result);  

          // add banners
          let banners = [];
          for (let b in result['banners_won']) {
            banners.push(
              <div>
                <img src={result['banners_won'][b]} />
              </div>
            )
          }
          setBannerList(banners)

          let ids = [];
          for (let i in result['most_teamed']) {
            ids.push(result['most_teamed'][i][0]);
          }

          // 2nd fetch for usernames for most teamed teammates
          fetch(`http://localhost:5000/api/name`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(ids)
          }).then( resp2 => resp2.json()).then( (res2) => {
              setUserOsuData(res2)
          })

          

        })
    }, []);

    const placementOptions = (data == false ? null : {
			title: {
				text: "Summary of placements"
			},
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
      theme: "light1",
			data: [
			{
				type: "pie",
				indexLabel: "{label}: {y}%",		
				startAngle: -90,
        dataPoints: Object.entries(data['most_played_mods']).map(([label, y]) => ({ label, y: y * 100 }))
			}
			]
		})
  
  const most_teamed = (data == false || userOsuData == false ? null : 
                      data['most_teamed'].map((member) => 
                      <div>
                        <p>{member[1]}</p>
                        <Member id={member[0]} username={userOsuData[member[0]]} />
                      </div>))

const wrbyModOptions = (data == false ? null : {
  title: {
    text: "Win Rate by Mod (by %)"
  },
  data: [
  {
    type: "column",
    dataPoints: Object.entries(data['win_rate_per_mod']).map(([label, y]) => ({ label, y: y * 100 })).sort((a, b) => {
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
      dataPoints: Object.entries(data['avg_score_per_mod']).map(([label, y]) => ({ label, y })).sort((a, b) => {
      if (a['y'] < b['y']) return 1;
      else if (a['y'] > b['y']) return -1;
      else return 0;
    })}]
  })
  
  
    
  return (
    <div>
        <Navbar />
        { data != false &&
          <div>
            {
              data['match_record'][0] >= data['match_record'][1] ? 
                <p>Lifetime Match Record <b>{data['match_record'][0]}</b> - {data['match_record'][1]}</p>
              : 
                <p>Lifetime Match Record {data['match_record'][0]} - <b>{data['match_record'][1]}</b></p>
            }
            {
              data['map_record'][0] >= data['map_record'][1] ? 
                <p>Lifetime Map Record <b>{data['map_record'][0]}</b> - {data['map_record'][1]}</p>
              : 
                <p>Lifetime Map Record {data['map_record'][0]} - <b>{data['map_record'][1]}</b></p>
            }

            <GeneralChart options={placementOptions}/>
            <h3>Most Teamed</h3>
            <ul style={{display: "flex"}}>{most_teamed}</ul>
            <h3>Banners Won</h3>
            <ul>{bannerList}</ul>
            <GeneralChart options={mostPlayedModsOptions}/>
            <GeneralChart options={wrbyModOptions}/>
            <BarChart options={avgScoreByModOptions}/>
            
            
          </div>
        }
    </div>
    
  )
  
}

export { StatsPage };