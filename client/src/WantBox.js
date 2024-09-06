import './GameComponent.css';
import {useState, useEffect} from 'react'

function WantBox({game_id, odds, updateWantDict, wantOdds}) {
    var [av1,setAv1] = useState()
    var [av2,setAv2] = useState()

    
    useEffect(() => {
        checkAvailable()
    },[wantOdds])

    
    function checkAvailable() {
        if (wantOdds) {
            let wo1 = parseFloat(wantOdds[0])
            let wo2 = parseFloat(wantOdds[1])
            if (wo1 < best1) {
                setAv1("availablePlus")
            } else if (wo1 == best1) {
                setAv1("available")
            } else {
                setAv1("")
            }
            if (wo2 < best2) {
                setAv2("availablePlus")
            } else if (wo2 == best2) {
                setAv2("available")
            } else {
                setAv2("")
            }
        }
    }

    let best1, best2;
    if (odds != undefined){
        best1 = odds[0]
        best2 = odds[1]
    } 

    function handleInput(newOdd, idx){
        console.log("Input ",idx," received: ",newOdd)
        // process .5 
        let last_digit = newOdd.slice(newOdd.length-1,newOdd.length)
        let jk = false
        if (newOdd.length == 1) {
            jk =true
        } else {
            let sec_last_digit = newOdd.slice(newOdd.length-2,newOdd.length-1)
            if(sec_last_digit == "-") {
                jk = true
            }
        }
        if (last_digit == "5" && !jk) {
            let beg = newOdd.slice(0,newOdd.length-1)
            newOdd = beg + ".5"
        }

        let o1 = ""
        let o2 = ""
        if (idx == 1){
            if (wantOdds) {
                o2 = wantOdds[1]
            }
            o1 = newOdd
        } else {
            if (wantOdds) {
                o1 = wantOdds[0]
            }
            o2 = newOdd
        }
        updateWantDict([o1,o2], game_id)
    }
    

    return (
        <>
            <div className="inputContainer">
                <input name="wantInput1" id={av1} type="number" step=".5" 
                    value={wantOdds ? wantOdds[0] : ""}
                    onChange={e => handleInput(e.target.value, 1)} 
                />
            </div>

            <div className="inputContainer ic2">
                <input name="wantInput2" id={av2} type="number" step=".5" 
                    value={wantOdds ? wantOdds[1] : ""}
                    onChange={e => handleInput(e.target.value, 2)} 
                />
            </div>
            
        </>
    );
}
  
export default WantBox;