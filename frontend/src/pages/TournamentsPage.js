
import './HomePage.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import { Component } from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'

let PageSize = 10;

const mongoose = require("mongoose");
let data;
const PASSWORD = process.env.PASSWORD
const URI = "mongodb+srv://byronfong:" + PASSWORD + "@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

const tournSchema = new mongoose.Schema({ });

const Tourn = mongoose.model('tournament_history', tournSchema);
  
Tourn.find((err, tourns) => {
if (err) {
    console.error(err);
} else {
    data = tourns
}
});
// data = Array(58)

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
                
    
            </div>
            <Pagination 
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={data.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}/>
            
        </div>

        
    )
}
      
export { TournamentsPage };