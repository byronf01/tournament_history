
import './Pages.css';
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import TournamentsBlock from '../components/TournamentsBlock'
import Spinner from '../components/Spinner'
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const API_URL_LOCAL = 'http://localhost:5000/api/data';
const API_URL = 'https://tournament-history-9rmu.vercel.app';
let PageSize = 10;

function TournamentsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState(Array(1));
    const [dataMaster, setDataMaster] = useState(Array(1));
    const [query, setQuery] = useState("");
    const [sorting, setSorting] = useState('a');
    const [timerId, setTimerId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTimeExpired, setLoadingTimeExpired] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const currentTableData = useMemo(() => {
      
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        const select = data.slice(firstPageIndex, lastPageIndex);
        return select
        
    }, [currentPage, data]);

    const sort_tourn = (items) => {
        if (sorting == 'a') {
            return items.sort( (a, b) => {
                if (a["title"].toLowerCase() <= b["title"].toLowerCase() ) return -1;
                else return 1
            });
        } else if (sorting == 'c') {
            return items.sort( (a, b) => {
                const ad = new Date(a['date_f']);
                const bd = new Date(b['date_f']);
                if (ad < bd) return -1;
                else return 1;
            });
        } else return items;
    }
    
    useEffect ( () => {
        let timer;
        
        fetch(`${API_URL}/api/data`).then( resp => resp.json())
        .then( (result) => {
        
            // sort array alphabetically by tournament title
            let items = result;
            sort_tourn(items)
            let tmp = Array(items.length);
            for (let i = 0; i < items.length; i++) {
                tmp[i] = items[i]
            }
            setData(tmp);
            setDataMaster(tmp);
            setIsLoading(false);
            clearTimeout(timer);
        
        })

            timer = setTimeout(() => {
                setLoadingTimeExpired(true);
                }, 20000);
            
            return () => clearTimeout(timer);
        
        }, []);

    useEffect(() => {
        let items = [...dataMaster];
        sort_tourn(items);
        setDataMaster(items);
        if (query !== "") {
            const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            const queriedData = items.filter((tourn) => (
            tourn['title'].toLowerCase().match(regex) ||
            tourn['acronym'].toLowerCase().match(regex) ||
            tourn['team_name'].toLowerCase().match(regex) ||
            tourn['notes'].toLowerCase().match(regex) ||
            tourn['comments'].toLowerCase().match(regex)
            ));
            setData(queriedData);
        } else {
            setData(items);
        }
        
    }, [sorting])

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
            const queriedData = dataMaster.filter((tourn) => (
            tourn['title'].toLowerCase().match(regex) ||
            tourn['acronym'].toLowerCase().match(regex) ||
            tourn['team_name'].toLowerCase().match(regex) ||
            tourn['notes'].toLowerCase().match(regex) ||
            tourn['comments'].toLowerCase().match(regex)
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
                color: "rgb(255,255,255)"}}>🏆 Tournaments 🏆</h1>
                </div>
        
            </div>
        
            <div >
            { dataMaster.length !== 1 &&
                <div>
                    {searchBar()}
                    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '1em', fontSize: '0.8em'}}>
                        <p style={{margin: 0}}>Sort by: </p>
                        <input type='radio' id='choice1' name='sorting' value='Alphabetical' defaultChecked onClick={() => {
                            setSorting('a');
                        }}/>
                        <label for="choice1">Alphabetical </label>
                        <input type='radio' id='choice2' name='sorting' value='Chronlogical' onClick={() => {
                            setSorting('c');
                        }}/>
                        <label for="choice2">Chronological </label>
                    </div>
                </div>
            }
            
            {isLoading && <Spinner />}
            {isLoading && loadingTimeExpired && <p style={{textAlign: 'center', fontSize: '1.2em'}}>Api failure, try again later</p>}
            {data.length > 1 ? <p style={{textAlign: 'center', fontSize: '1.2em', marginTop: '0.4em'}}>{data.length} tournaments found</p> :
            data.length === 1 && typeof(data[0]) != 'undefined' ? <p style={{textAlign: 'center', fontSize: '1.2em', marginTop: '0.4em'}}>{data.length} tournament found</p> : null }
            {data.length !== 0 && <Pagination 
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={data.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                    dataInfo={data}
                    setData={setData} 
                    style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}/>
            }
            
            {data.length === 0 && !isLoading && <p style={{textAlign: 'center', fontSize: '1.2em'}}>No Results Found</p>}
            {data.length !== 0 && <TournamentsBlock tourns={currentTableData} />}
            {data.length !== 0 && <Pagination 
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={data.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                    dataInfo={data}
                    setData={setData} 
                    style={{textAlign: "center", marginLeft: "auto", marginRight: "auto"}}/>
            }
            </div>
        </div>
    )
}
      
export { TournamentsPage };