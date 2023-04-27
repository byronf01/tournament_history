import React, { useState } from 'react';

function TournamentPreview( {new_key, new_data} ) {
    // Data should be an Obj
    const [name, setName] = useState(new_key);
    const [data, setData] = useState(new_data);

    // Things needed:

    // Banner (get from forum post) // TO-DO

    // Tournament name

    // Start date 

    // Forum post
    const start = data[new_key]['date_f'].split("T")[0]
    const forum = data[new_key]['forum']

    return (
        <div>
            <p>{start}</p>
            <p>{forum}</p>
        </div>
    )
}

export default TournamentPreview;