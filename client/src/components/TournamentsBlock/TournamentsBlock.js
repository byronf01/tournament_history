import React, { useEffect, useState } from 'react';
import TournamentPreview from '../TournamentPreview'

function TournamentsBlock( {tourns} ) {
    const [currentData, setcurrentData] = useState("");
    const [empty, setEmpty] = useState(true);
    // const [block, setBlock] = useState("")
    let block = [];

    /*
    useEffect ( () => {
        // Check if array contains information
        if (tourns.includes()) {
            setEmpty(true)
        } else {
            // change currentData to reflect tourns
            let newData = [];
            for (let i = 0; i < tourns.length; i++) {
                newData.push(Object.keys(tourns[i])[0]) // keeps key
                newData.push(tourns[i+1]) // keeps key's data
            }
            setcurrentData(newData)
            console.log(newData)
            console.log(currentData)

            // If this is the first time tourns has info, change block
            if (block == "") {
                let tmp = []
                for (let i = 0; i < tourns.length; i++) {
                    tmp.push(<TournamentPreview new_key={currentData[i]} new_data={currentData[i+1]} />)
                }
                setBlock(tmp)
            }
            // Finally set block visible
            setEmpty(false)
        }
    }, [tourns])
    */
    useEffect ( () => {
        if (tourns.includes()) {
            setEmpty(true)
        } else {
            block.length = 0
            for (let i = 0; i < tourns.length; i++) {
                block.push(<TournamentPreview new_key={Object.keys(tourns[i])[0]} new_data={tourns[i]} />)
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
