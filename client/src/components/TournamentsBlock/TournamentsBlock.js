import React, { useEffect, useState } from 'react';
import TournamentPreview from '../TournamentPreview'

function TournamentsBlock( {tourns} ) {
    const [currentData, setcurrentData] = useState("");
    const [empty, setEmpty] = useState(true);
    let block = [];

    
    useEffect ( () => {
        if (tourns.includes()) {
            setEmpty(true)
        } else {
            block.length = 0
            for (let i = 0; i < tourns.length; i++) {
                block.push(<TournamentPreview new_data={tourns[i]} />)
            }
            setcurrentData(block)
            setEmpty(false)
        }
    }, [tourns])

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

export default TournamentsBlock;
