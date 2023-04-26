
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'

let PageSize = 10;

function TournamentsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState({'foo': 'bar'});
    
    /*
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data.slice(firstPageIndex, lastPageIndex);
        }, [currentPage]);
    */
    
        
    useEffect ( () => {
        fetch('http://localhost:5000/api/data').then( resp => resp.json())
            .then( (result) => {
                let dict = {};
                for (let i = 0; i < result.length; i++) {
                    const name = Object.keys(result[i])[1]
                    const vals = result[i][name]
                    dict[name] = vals
                }
                setData(dict);
            })
        }, []);
    
    return (
        <div>
            <Navbar />
            <div style={{paddingLeft: "10%", 
                paddingRight: "10%"}}>
                <div>
                <h1 style={{textAlign: "center", 
                fontSize: "50px",
                color: "rgb(255,255,255)"}}>🏆 Tournaments 🏆</h1>
                </div>
                
    
            </div>
            {/* Display Data Here */}
            <Pagination 
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={Object.keys(data).length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                    dataInfo={data}
                    setData={setData}/>
                    
            
        </div>

        
    )
}
      
export { TournamentsPage };