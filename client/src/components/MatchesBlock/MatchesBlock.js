import React, { useEffect, useState } from 'react';
import MatchPreview from '../MatchPreview'

function MatchesBlock( {matches} ) {
    const [currentData, setcurrentData] = useState("");
    const [empty, setEmpty] = useState(true);
    
    let block = [];
    useEffect ( () => {
        if (matches.includes()) {
            setEmpty(true)
        } else {
            block.length = 0
            for (let i = 0; i < matches.length; i++) {
                block.push(<MatchPreview acronym={matches[i]['acronym']} mp={matches[i]['mp']} stage={matches[i]['stage']} match_name={matches[i]['match_name']} result={matches[i]['result']} teams={matches[i]['teams']} />)
            }
            setcurrentData(block)
            setEmpty(false)
        }
    }, [matches])
    

    return (
        <div>
            {
                empty == false && 
                    <div className='matches-block' style={{display: 'flex', justifyContent: 'left', }}>
                        <ul style={{padding: 0, width: '100%'}}>{currentData}</ul>
                    </div>
            }
            
        </div>
    )

}

export default MatchesBlock;
