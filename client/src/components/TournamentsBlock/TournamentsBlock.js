import React, { useEffect } from 'react';
import Tournament from '../Tournament'

function TournamentsBlock( {tourns} ) {
    console.log(tourns)
    let empty = false;
    const block = [];
    // Test for default null value, 
    if (tourns.includes()) {
        empty = true;
    } else {
        // Displays Tournament components from tourns
        for (let i = 0; i < tourns.length; i++) {
            block.push(<Tournament key={Object.keys(tourns[i])[0]} data={tourns[i]} />)
        }
        console.log(block)
    }

    return (
        <div>
            <p>----</p>
            {
                empty == false && 
                    <ul>{block}</ul>
            }
            
        </div>
    )

}

export default TournamentsBlock;