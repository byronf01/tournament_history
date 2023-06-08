
import './Pages.css';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import MatchesBlock from '../components/MatchesBlock'
import Spinner from '../components/Spinner'
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const API_URL_LOCAL = 'http://localhost:5000/api/data';
const API_URL = 'https://tournament-history-9rmu-maxy7da5q-byronf01.vercel.app';
let PageSize = 20;

function MatchesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(Array(1));
  const [dataMaster, setDataMaster] = useState(Array(1));
  const [query, setQuery] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeExpired, setLoadingTimeExpired] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dataFetchedRef = useRef(false);

  const currentTableData = useMemo(() => {
      
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      const select = data.slice(firstPageIndex, lastPageIndex);
      return select
      
  }, [currentPage, data]);

  const fetchData = () => {
  let timer;
      
  fetch(`${API_URL}/api/matches`).then( resp => resp.json())
      .then( (res) => {

          // get list of Matches alphabetically sorted by acronym value
          let sorted = res.sort((m1, m2) => {
              
              if (m1["acronym"].toLowerCase() < m2["acronym"].toLowerCase()) return -1;
              else if (m1['acronym'].toLowerCase() > m2['acronym'].toLowerCase()) return 1;
              else { // stage by tiebreaker
                if (m1['stage'] == 'Qualifiers') return 1; // Qualifiers highest precedence
                else if (m2['stage'] == 'Qualifiers') return -1;
                else { // None of matches are qualifiers
                  const s1 = parseInt(m1['stage'].split(' ')[1])
                  const s2 = parseInt(m2['stage'].split(' ')[2])
                  if (s1 <= s2) return -1;
                  else return 1;
                }
              };
              
              
          });
          setData(sorted);
          setDataMaster(sorted);
          setIsLoading(false);
          clearTimeout(timer);
          
      })

      timer = setTimeout(() => {
        setLoadingTimeExpired(true);
      }, 20000);
    
      return () => clearTimeout(timer);
   }

  useEffect(() => {
  const handleResize = () => {
      setWindowWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  return () => {
      window.removeEventListener('resize', handleResize);
  };
  }, []);
    
  const searchBar = () => {
      if (windowWidth < 600) {
          return (
              <div style={{textAlign: 'center'}}>
                  <TextField
                      id="search"
                      type="search"
                      placeholder='Search...'
                      value={query}
                      onChange={changeQuery}
                      sx={{ width: '80vw', borderRadius: 10 }}
                      InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      style={{backgroundColor: '#FFFFFF'}}
                  />
              </div>
          );
      } else {
          return (
              <div style={{textAlign: 'center'}}>
                  <TextField
                      id="search"
                      type="search"
                      placeholder='Search...'
                      value={query}
                      onChange={changeQuery}
                      sx={{ width: '40vw', borderRadius: 10 }}
                      InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      style={{backgroundColor: '#FFFFFF'}}
                  />
              </div>
          )
      }
  }

    useEffect(() => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      fetchData();
    },[])


    const changeQuery = (event) => {
      setQuery(event.target.value);
      
      if (timerId) {
          clearTimeout(timerId); // Clear previous timer if it exists
      }
      
      const newTimerId = setTimeout(() => {
          applyQueryFilter(event.target.value);
      }, 1000);
      
      setTimerId(newTimerId);
      setIsLoading(true);
  };

  const applyQueryFilter = (newQuery) => {
      if (newQuery !== "") {
          const regex = new RegExp(newQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
          const queriedData = dataMaster.filter((m) => (
            // search in match name
            m['match_name'].toLowerCase().match(regex) 

            // search in players in match
            || m['users'].some((u) => u.toLowerCase().match(regex))
         
            
          ));
          setData(queriedData);
      } else {
        setData(dataMaster);
      }
      setIsLoading(false);
      setCurrentPage(1) // reset
  };
    
  return (
    <div>
      <Navbar />
      
      <div style={{paddingLeft: "10%", 
                paddingRight: "10%"}}>
          <div>
          <h1 className='title-header' style={{textAlign: "center", 
          marginTop: '0.6em',
          marginBottom: '0.6em',
          fontFamily: 'trebuchet ms',
          textShadow: '3px 3px #505F74',
          color: "rgb(255,255,255)"}}>🆚 Matches 🆚</h1>
          </div>
      </div>

      { dataMaster.length !== 1 &&
        <div>
          {searchBar()}
        </div>
      }
      {isLoading && <Spinner />}
      {isLoading && loadingTimeExpired && <p style={{textAlign: 'center', fontSize: '1.2em'}}>Api failure, try again later</p>}
      {data.length > 1 ? <p style={{textAlign: 'center', fontSize: '1.2em'}}>{data.length} matches found</p> :
      data.length === 1 && typeof(data[0]) != 'undefined' ? <p style={{textAlign: 'center', fontSize: '1.2em'}}>{data.length} match found</p> : null }
      
      {data.length === 0 && !isLoading && <p style={{textAlign: 'center', fontSize: '1.2em'}}>No Results Found</p>}
      {data.length != 0 && <Pagination 
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
        dataInfo={data}
        setData={setData} 
        style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}/>}
      {data.length != 0 && <MatchesBlock matches={currentTableData} />}
      
      

      {data.length != 0 && <Pagination 
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
        dataInfo={data}
        setData={setData} 
        style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}/>}
    </div>
    
  )
  
}

export { MatchesPage };