
import './HomePage.css';
import React, { useState, useMemo, useEffect} from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import MatchesBlock from '../components/MatchesBlock'

let PageSize = 20;

function MatchesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(Array(1));

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
          
            
        })
       

    }, []);
    
  return (
    <div>
      <Navbar />
      
      <MatchesBlock matches={currentTableData} />

      <Pagination 
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
        dataInfo={data}
        setData={setData} 
        style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}/>
    </div>
    
  )
  
}

export { MatchesPage };