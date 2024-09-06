import './OddsTypeBar.css';
import {useEffect, useState} from 'react';
import SportDropdown from './SportDropdown.js';

function OddsTypeBar({changeMarket, changeSport, setAllBooks, refreshOdds, reqUsed}) {
    var [activeOddsButton, setActiveOddsButton] = useState()
    var [allBooksLocal, setAllBooksLocal] = useState(false)
    
    function changeOddsType(mkt){
        // do css syuff and highlight
        setActiveOddsButton(mkt);
        // callback to App.js to change state there
        changeMarket(mkt);
    }

    function callRefresh(){
        console.log("refreshing")
        refreshOdds()
    }

    function toggleAllBooks(){
        let new_state = !allBooksLocal
        setAllBooksLocal(new_state)
        setAllBooks(new_state)
    }

    useEffect(() => {
        setActiveOddsButton("spreads");
        changeMarket("spreads");
    },[]);

    return (
        <div id="oddsTypeContainer">
            <SportDropdown changeSport={changeSport}></SportDropdown>

            <button id="btn-h2h" 
                className={activeOddsButton === "h2h" ? "activeOddsBtn" : ""} 
                onClick={() => {changeOddsType("h2h")}}>
                    ML
            </button>
            <button id="btn-spreads" 
                className={activeOddsButton === "spreads" ? "activeOddsBtn" : ""} 
                onClick={() => {changeOddsType("spreads")}}>
                    SPR
            </button>
            <button id="btn-totals" 
                className={activeOddsButton === "totals" ? "activeOddsBtn" : ""} 
                onClick={() => {changeOddsType("totals")}}>
                    TOT
            </button>


            <button id="books-btn" 
                className={allBooksLocal === true ? "activeOddsBtn" : ""} 
                onClick={() => {toggleAllBooks()}}>
                    ALL<br></br>BOOKS
            </button>

            <button id="refresh-btn" 
                className=""
                onClick={() => {callRefresh()}}>
                    ↻
            </button>

            <div id="reqContainer">
                <p id="reqTitle" className="reqP">Requests</p>
                <p id="reqUsed" className="reqP">{reqUsed}/500</p>
            </div>
            
        </div>
    );
}
  
export default OddsTypeBar;