
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'

let PageSize = 10;

/*
class TournamentsPage extends Component {



render() {

    const [currentPage, setCurrentPage] = useState(1);
    
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data.slice(firstPageIndex, lastPageIndex);
      }, [currentPage]);

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
            <Pagination 
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)}/>

        </div>
        
        
    </div>
    
    )
}
}
*/
let data = Array(100)

function TournamentsPage() {
    const [currentPage, setCurrentPage] = useState(1);
        
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data.slice(firstPageIndex, lastPageIndex);
        }, [currentPage]);
    
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
                <Pagination 
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={data.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}/>
    
            </div>
            
            
        </div>

        
    )
}
      
export { TournamentsPage };