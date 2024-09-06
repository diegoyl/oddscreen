import React, {useState, useEffect} from 'react';
import OddsTypeBar from './OddsTypeBar.js';
import OddsTable from './OddsTable.js';
import Loading from './Loading.js';

// import logo from './logo.svg';
import './App.css';

const myBooks = [
    // my books for ui, no sharp books displayed
    "fanduel",
    "draftkings",
    "williamhill_us",
    "betmgm",
    "espnbet",
    "ballybet",
    // "betrivers",
    "fliff"
]
const defaultSport = "americanfootball_nfl";
const defaultMarket = "spreads";

function App() {
  var [currentOddsData, setCurrentOddsData] = useState()
  var [totalsData, setTotalsData] = useState()
  var [spreadsData, setSpreadsData] = useState()
  var [moneylinesData, setMoneylinesData] = useState()
  var [initTotals, setInitTotals] = useState()
  var [gameIDs, setGameIDs] = useState()
  var [requestsUsed, setRequestsUsed] = useState()
  var [marketKey, setMarketKey] = useState(defaultMarket)
  var [sportKey, setSportKey] = useState(defaultSport)
  var [loading, setLoading] = useState(false)
  var [allBooks, setAllBooks] = useState(false)


  var gameDictParsed = []

  const refreshOdds = async () => {
    if (sportKey === undefined){setSportKey(defaultSport)}
    console.log("refreshing odds with headers: ",marketKey," | ",sportKey, " | ", allBooks)

    try {
        setLoading(true)
        fetch("http://localhost:4000/oddsAPI",{
          headers:{
            "markets":marketKey,
            "sport":sportKey,
            "allbooks":allBooks
          }
        }).then(res => res.text()).then(
          data => {
            const json_parsed = JSON.parse(data); // data = [gameDict, reqUsed]
            setLoading(false)
            
            setRequestsUsed(json_parsed[1])
            
            gameDictParsed = json_parsed[0];
            if(marketKey === "h2h") {
              setMoneylinesData(gameDictParsed);
            } else if (marketKey === "spreads") {
              setSpreadsData(gameDictParsed);
            } else if (marketKey === "totals") {
              setTotalsData(gameDictParsed);
            } else{
              console.log("MARKET ERROR WHEN SETTING gameDictParsed in App.js")
            }
            setCurrentOddsData(gameDictParsed);
            updateLocalGameDicts(gameDictParsed)

            // get all game IDs
            var id_keys = Object.keys(gameDictParsed)
            setGameIDs(id_keys);
        })
    } catch (err) {
        console.log(err.message)
        setLoading(false)
    }
  }
  // END REFRESH ODDS

  useEffect(() => {
    console.log('1. UseEffect Initializing...')
    pullRequestsSaved()
    pullAllSaved().then(() =>{
      // console.log('5. back to useeeffect')
    })
  }, []);

  async function pullAllSaved() {
    console.log('2. pullAllSaved() async ...')

    pullSavedGameDict("h2h").then(() =>{
      console.log('\t3.3a DONE W ML')
    }).then(() =>{
      pullSavedGameDict("spreads").then(() =>{
        console.log('\t3.3b DONE W SPR')
      }).then(() =>{
        pullSavedGameDict("totals").then(() =>{
          console.log('\t3.3c DONE W TOT')
          console.log('\t3.TotalsData: ',totalsData)

        }).then(() => {
          console.log('4. pullAllSaved() finished, setLoading=False')
          // setTimeout(() => {
          //   setLoading(false)
          //   console.log('T.T : Timeout Done, calling changeOddSettings')
          //   // setMarketKey(defaultMarket, changeOddsSettings() )
          //   setMarketKey(prev => "defaultMarketYur", s => console.log(marketKey), s)
          // }, 1000)
        })
      })
    })
  }

  async function pullSavedGameDict(pullMkt) {
    console.log('3. pullSavedGameDict...',pullMkt)
    // new Promise
    try {
      setLoading(true)
      await fetch("http://localhost:4000/oddsAPI/gamedict",{
        headers:{
          "market":pullMkt,
        }
      }).then(res => res.text()).then(
        data => {
          console.log("\t3.1 then => ", pullMkt)
          const gameDictParsed = JSON.parse(data); // data = gameDict
          
          if(pullMkt === "h2h") {
            console.log("\t\t3.1a$  setting ML")
            setMoneylinesData(gameDictParsed);
            this.setState({moneylinesData:gameDictParsed}, () => {
              console.log("\t\t\t3.1a ",moneylinesData)
            })

          } else if (pullMkt === "spreads") {
            console.log("\t\t3.1b$  setting spr")
            setSpreadsData(gameDictParsed);
          } else if (pullMkt === "totals") {
            console.log("\t\t3.1c$  setting tot")
            setTotalsData(gameDictParsed);
            setInitTotals(gameDictParsed);
          } else{console.log("pullMkt ERROR WHEN SETTING gameDictParsed in App.js")}
          // return gameDictParsed
      })
    } catch (err) {
        console.log(err.message)
        console.log("CATCH ERROR IN pullSavedGameDict function")
    }
  }

  async function pullRequestsSaved() {
    console.log('#. REQUESTS PULL...')
    try {
      await fetch("http://localhost:4000/oddsAPI/reqs")
      .then(res => res.text()).then(
      data => {
        const responseArr = JSON.parse(data); // data = [reqs]]
        console.log('#. responseArr = ',responseArr)
        console.log('#. responseArr typ = ',typeof responseArr)
        const reqsPulled = responseArr[0]; // data = [reqs]]
        console.log('#. REQUESTS = ',reqsPulled)
        setRequestsUsed(reqsPulled)
      })
    } catch (err) {
        console.log(err.message)
        console.log("CATCH ERROR IN pullRequestsSaved function")
    }
  }


  useEffect(() => {
    changeOddsSettings();
  }, [marketKey, sportKey]);

  useEffect(() => {
    if (typeof initTotals != "undefined"){
      setLoading(false)
      console.log("INIT TOTALS DONE")
      changeOddsSettings()
    }
  }, [initTotals]);

  function changeOddsSettings() {
    if (typeof initTotals == "undefined") {
      console.log("\t\t--- 5X KEY CHANGE ABORTED CUS STILL INIT")
    } else {
      console.log("5. KEY CHANGE")
      console.log("5. ",totalsData)

      var savedData;
      if (marketKey === "h2h"){
        console.log("\t5. Switching to saved ML")
        savedData = moneylinesData
      } else if (marketKey === "spreads"){
        console.log("\t5. Switching to saved spreads")
        savedData = spreadsData
      } else if (marketKey === "totals"){
        console.log("\t5. % Switching to saved totals")
        savedData = totalsData
      } else {
        console.log("BIGERROR no market defined in changed odds settings")
      }

      console.log("\t5%  ",savedData)

      setCurrentOddsData(savedData)
      setGameIDs(Object.keys(savedData));
    }
  }
  function updateLocalGameDicts(gameDictParsed) {
    if (marketKey === "h2h"){
      console.log("Updating saved ML")
      setMoneylinesData(gameDictParsed)
    } else if (marketKey === "spreads"){
      console.log("Updating saved spreads")
      setSpreadsData(gameDictParsed)
    } else if (marketKey === "totals"){
      console.log("Updating saved totals")
      setTotalsData(gameDictParsed)
    } 
  }


  return (
    <div className="App">
      {loading ? (
        <Loading></Loading>
      ) : (
        <></>
      )}
      
      {/* <div  className="lineGraphContainer">
        <LineGraph chartData={{times:[],odds:{}}}></LineGraph>
      </div> */}
      
      <div style={{height:"1em"}}></div>
      <h1>MY ODDS SCREEN :)</h1>

      <div id="main-content">
        <OddsTypeBar 
          changeMarket={setMarketKey} 
          changeSport={setSportKey} 
          setAllBooks={setAllBooks} 
          refreshOdds={refreshOdds}
          reqUsed={requestsUsed}
        ></OddsTypeBar>
        
        <OddsTable 
          currentOddsData={currentOddsData} 
          gameIDs={gameIDs} 
          myBooks={myBooks}
          marketKey={marketKey}
          sportKey={sportKey}  
        ></OddsTable>
      </div>


      <div style={{height:"25em"}}></div>
      
    </div>
  );
}

export default App;



