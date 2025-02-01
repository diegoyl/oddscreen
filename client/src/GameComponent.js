import {useState, useEffect} from 'react'
import './GameComponent.css';
import './TeamColors.css';
import OddsBoxH2H from './OddsBoxH2H.js';
import OddsBoxSpread from './OddsBoxSpread.js';
import OddsBoxTotal from './OddsBoxTotal.js';
import HoldBox from './HoldBox.js';
import ChartBox from './ChartBox.js';
import WantBox from './WantBox.js';

function GameComponent({game_id, oddsData, myBooks, marketKey, sportKey, updateWantDict, wantOdds, toggleTrack}) {
    // console.log("$ ", oddsData)
    if (oddsData === "undefined" || oddsData === undefined) {
        console.log("$ UNDEFINED ", oddsData)
        console.log("$ UNDEFINED ", game_id)
    }
    var home = oddsData["home"]
    var away = oddsData["away"]
    var odds = oddsData["odds"]
    var calcs = oddsData["calcs"]
    var times = oddsData["times"]

    var chartData = oddsData["chartData"]
    
    var bestBooks1 = calcs["bestBooks1"]
    var bestBooks2 = calcs["bestBooks2"]



    return (
      <div id="" className="fullTableRow tableRow-content">
        <div className="column c-date c-date-content" onClick={() => toggleTrack(game_id)}>
            <p className="">{times["weekday"]}</p>
            <p className="">{times["time"]}</p>
        </div>
        <div className="column c-team c-team-content c-full-height">
            <p className={"DEFAULT "+home+"_"+sportKey}>{home}</p>
            <p className={"DEFAULT "+away+"_"+sportKey}>{away}</p>
        </div>
        <div className="column c-want c-want-content">
            <WantBox key={"want_x_"+home+away} game_id={game_id} odds={calcs["best"]} updateWantDict={updateWantDict} wantOdds={wantOdds}></WantBox>
        </div>
        <div className="column c-best c-best-content">
            <OddsBoxH2H key={"best_x_"+home+away} odds={calcs["best"]}></OddsBoxH2H>
        </div>
        <div className="column c-hold c-hold-content c-full-height">
            <HoldBox key={"hold_x_"+home+away} hold_arr={calcs["hold"]} mkt={marketKey}></HoldBox>
        </div>
        <div className="column c-chart c-chart-content c-full-height">
            {/* <p className="doubleRow">{calcs["avg"]}</p> */}
            <ChartBox chartData={chartData} curAvg={calcs["avg"]} home={home} away={away}></ChartBox>
        </div>
        
        {marketKey==="h2h" && myBooks.map(book_id => (
            <div className="column c-book c-book-content">
                <OddsBoxH2H key={book_id+"_x_"+home+away} book_id={book_id} odds={odds[book_id]} bestBooks1={bestBooks1} bestBooks2={bestBooks2}></OddsBoxH2H>
            </div>
        ))}
        {marketKey==="spreads" && myBooks.map(book_id => (
            <OddsBoxSpread key={book_id+"_x_"+home+away} book_id={book_id} odds={odds[book_id]} bestBooks1={bestBooks1} bestBooks2={bestBooks2}></OddsBoxSpread>
        ))}
        {marketKey==="totals" && myBooks.map(book_id => (
            <OddsBoxTotal key={book_id+"_x_"+home+away} book_id={book_id} odds={odds[book_id]} bestBooks1={bestBooks1} bestBooks2={bestBooks2}></OddsBoxTotal>
        ))}

      </div>


    );
}
  
export default GameComponent;