import React, { useEffect, useState } from 'react';
import TournamentPreview from '../TournamentPreview'

function TournamentsBlock( {tourns} ) {
    const [current, setCurrent] = useState("");
    const [empty, setEmpty] = useState(true);

    useEffect ( () => {
        if (tourns.includes()) {
            setEmpty(true)
        } else {
            let block = []
            for (let i = 0; i < tourns.length; i++) {
                block.push(<TournamentPreview new_key={Object.keys(tourns[i])[0]} new_data={tourns[i]} />)
            }
            setCurrent(block)
            setEmpty(false)
        }
    }, [tourns])

    return (
        <div>
            <p>----</p>
            {
                empty == false && 
                    <div>
                        <p>Tournaments Block Displayed! </p>
                        <ul>{current}</ul>
                    </div>
            }
            
        </div>
    )

}

export default TournamentsBlock;