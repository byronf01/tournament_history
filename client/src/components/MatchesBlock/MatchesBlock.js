import React, { useEffect, useState } from 'react';
import MatchPreview from '../TournamentPreview'

function MatchesBlock( {matches} ) {
    const [currentData, setcurrentData] = useState("");
    const [empty, setEmpty] = useState(true);
    
    let block = [];
    /*
    useEffect ( () => {
        if (matches.includes()) {
            setEmpty(true)
        } else {
            block.length = 0
            for (let i = 0; i < tourns.length; i++) {
                block.push(<MatchPreview new_key={Object.keys(tourns[i])[0]} new_data={tourns[i]} />)
            }
            setcurrentData(block)
            setEmpty(false)
        }
    }, [tourns])
    */

    return (
        <div>
            {
                empty == false && 
                    <div>
                        <ul>{currentData}</ul>
                    </div>
            }
            
        </div>
    )

}

export default MatchesBlock;
