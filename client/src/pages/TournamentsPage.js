
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import TournamentsBlock from '../components/TournamentsBlock'

let PageSize = 10;

function TournamentsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState(Array(1));

    const currentTableData = useMemo(() => {
        
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        const select = data.slice(firstPageIndex, lastPageIndex);
        return select
        
    }, [currentPage, data]);
    
    
    useEffect ( () => {
        
        fetch('http://localhost:5000/api/data').then( resp => resp.json())
            .then( (result) => {
            
                // sort array alphabetically by tournament title
                let items = result;
                items.sort( (a, b) => {
                    if (a["title"].toLowerCase() <= b["title"].toLowerCase() ) return -1;
                    else return 1
                })
                let tmp = Array(items.length);
                for (let i = 0; i < items.length; i++) {
                    tmp[i] = items[i]
                }
                console.log(tmp)
                setData(tmp);
                
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
            <TournamentsBlock tourns={currentTableData} />
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
      
export { TournamentsPage };