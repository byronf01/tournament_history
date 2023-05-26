
import './HomePage.css';
import React, { useState, useMemo, useEffect} from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import MatchesBlock from '../components/MatchesBlock'

let PageSize = 20;

function MatchesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(Array(1));
  const [dataMaster, setDataMaster] = useState(Array(1));
  const [query, setQuery] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentTableData = useMemo(() => {
      
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      const select = data.slice(firstPageIndex, lastPageIndex);
      return select
      
  }, [currentPage, data]);

  useEffect ( () => {
        
    fetch('http://localhost:5000/api/matches').then( resp => resp.json())
        .then( (res) => {

            // get list of Matches alphabetically sorted by acronym value
            let sorted = res.sort((m1, m2) => {
                if (m1["acronym"].toLowerCase() <= m2["acronym"].toLowerCase()) return -1;
                else return 0;
            });
            setData(sorted);
            setDataMaster(sorted);
        })
      
    }, []);

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
          const regex = newQuery.toLowerCase().replace('\\','\\\\');
          const queriedData = dataMaster.filter((m) => (
          m['match_name'].toLowerCase().match(regex) 
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
          <h1 style={{textAlign: "center", 
          fontSize: "50px",
          color: "rgb(255,255,255)"}}>🆚 Matches 🆚</h1>
          </div>
      </div>


      { dataMaster.length != 1 &&
        <input type="text" value={query} onChange={changeQuery} placeholder='Search for a specific match...'/>
      }
      {isLoading && <p>Loading...</p>}

      {data.length > 1 ? <p>{data.length} matches found</p> :
      data.length == 1 && typeof(data[0]) != 'undefined' ? <p>{data.length} match found</p> : null }
      
      {data.length === 0 && !isLoading && <p>No Results Found</p>}
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