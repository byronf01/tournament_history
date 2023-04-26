import React, { useState } from 'react';

function Tournament( {key, new_data} ) {
    // Data should be an Obj
    const [data, setData] = useState(new_data);

    // Things needed:

    // Banner (get from forum post) // TO-DO

    // Tournament name

    // Start date 

    // Forum post
    const start = data[key]['date_f']
    const forum = data[key]['forum']

    return (
        <div>
            <time datetime={start} />
            <p>{forum}</p>
        </div>
    )
}

export default Tournament;