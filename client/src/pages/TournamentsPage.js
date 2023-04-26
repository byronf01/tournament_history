
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
    // const [currentTableData, setcurrentTableData] = useState(Array(10));

    const currentTableData = useMemo(() => {
        
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        const select = data.slice(firstPageIndex, lastPageIndex);
        return select
        
    }, [currentPage, data]);
    
    
    useEffect ( () => {
        fetch('http://localhost:5000/api/data').then( resp => resp.json())
            .then( (result) => {
            
                let dict = {};
                for (let i = 0; i < result.length; i++) {
                    const name = Object.keys(result[i])[1]
                    const vals = result[i][name]
                    dict[name] = vals
                }
                // get list of Tournaments alphabetically sorted
                let key = Object.keys(dict).sort((k1, k2) => {
                    if (k1 < k2) return -1;
                    else if (k1 > k2) return 1;
                    else return 0;
                });
                let tmp = Array(key.length)
                for (let i = 0; i < key.length; i++) {
                    const foo = {}
                    foo[key[i]] = dict[key[i]]
                    tmp[i] = foo;
                }
                
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
                    setData={setData}/>
                    
            
        </div>

        
    )
}
      
export { TournamentsPage };