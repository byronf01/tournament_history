import React, { useState, useEffect } from 'react';

const RangeSlider = (props) => {
    const raw_range = props.range;
    const MIN_RANGE = 1;
    const MAX_RANGE = 100000;
    const [lo, setLo] = useState(MIN_RANGE);
    const [hi, setHi] = useState(MAX_RANGE)


    useEffect( () => {
        if (raw_range == 'Open Rank') {
            ; // 1-100000
        } else if (raw_range.includes('-')) {
            let [first, sec] = raw_range.split('-');
            // Interesting case with input like '7.5k' -> '7500'
            if (first.includes('.') && first.includes('k')) {
                first = first.replace('+', '').replace('.', '').replace('k', '00')
            } else {
                first = first.replace('+', '').replace('.', '').replace('k', '000')
            }

            if (sec.includes('.') && sec.includes('k')) {
                sec = sec.replace('+', '').replace('.', '').replace('k', '00')
            } else {
                sec = sec.replace('+', '').replace('.', '').replace('k', '000')
            }
            
            first = parseInt(first);
            sec = parseInt(sec);
    
            setLo(first);
            setHi(sec);
            
        } else if (raw_range.includes('+')) {
            // Interesting case with input like '7.5k' -> '7500'
            let lower;
            if (raw_range.includes('.')) {
                lower = raw_range.replace('+', '').replace('.', '').replace('k', '00')
            } else {
                lower = raw_range.replace('+', '').replace('.', '').replace('k', '000')
            }
            lower = parseInt(lower)
            setLo(lower);
        } else { // Unexpected case
            ;
        }
    }, [])

    const fillColor = () => {
        let percent1 = (lo / MAX_RANGE) * 100;
        let percent2 = (hi / MAX_RANGE) * 100;
        return {
            background: `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`
        }
    }
        
    
    return (
      <div>
        <div class="wrapper" style={{backgroundColor: "transparent", width: "32vw"}}>
            <div class="values" style={{marginBottom: "-3rem", width: '11vw', height: '1.5vw', fontSize: '1.2vw'}}>
                <span id="range1">
                    {lo}
                </span>
                <span> - </span>
                <span id="range2">
                    {hi}
                </span>
            </div>
            <div class="labels" style={{marginBottom: "-3rem", width: '33vw', height: '5vw'}}>
                <div style={{display: "flex", justifyContent: "space-between", fontSize: '1vw'}}>
                    <p style={{fontSize: "1.5em", color: "#FFFFFF"}}>{MIN_RANGE}</p>
                    <p style={{fontSize: "1.5em", color: "#FFFFFF"}}>{MAX_RANGE}+</p>
                </div>
            </div>
            <div class="container" >
                
                <div class="sliders" >
                    <div class="slider-track" style={fillColor()}></div>
                    <input type="range" min={MIN_RANGE} max={MAX_RANGE} value={lo} id="slider-1" on/>
                    <input type="range" min={MIN_RANGE} max={MAX_RANGE} value={hi} id="slider-2" />
                </div>
                
            </div>
        </div>
        
       
      </div>
    );
  };

export { RangeSlider };