import React, {useState, useEffect} from 'react';
import OddsTypeBar from './OddsTypeBar.js';
import OddsTable from './OddsTable.js';
import Loading from './Loading.js';
import CsvConfirmation from './CsvConfirmation.js';
import OddsTableHeader from './OddsTableHeader.js';

// import logo from './logo.svg';
import './App.css';

const myBooks = [
    // my books for ui, no sharp books displayed
    "betonlineag",
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
  var [totalsCSV, setTotalsCSV] = useState()
  var [spreadsCSV, setSpreadsCSV] = useState()
  var [moneylinesCSV, setMoneylinesCSV] = useState()
  var [initTotals, setInitTotals] = useState()
  var [gameIDs, setGameIDs] = useState()
  var [trackIDs, setTrackIDs] = useState()
  var [nontrackIDs, setNontrackIDs] = useState()
  var [requestsUsed, setRequestsUsed] = useState()
  var [marketKey, setMarketKey] = useState(defaultMarket)
  var [sportKey, setSportKey] = useState(defaultSport)
  var [loading, setLoading] = useState(false)
  var [allBooks, setAllBooks] = useState(false)
  var [copyCSV, setCopyCSV] = useState()
  var [csvConfirmation, setCsvConfirmation] = useState(false)

  const [, updateIDstates] = React.useState();
  const forceUpdateID = React.useCallback(() => updateIDstates({}), []);
 

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
            const json_parsed = JSON.parse(data); // data = [gameDict, reqUsed, gamesCSV]
            setLoading(false)
            
            gameDictParsed = json_parsed[0];
            setRequestsUsed(json_parsed[1])
            let currentCSV = json_parsed[2];
            setCopyCSV(currentCSV)
            

            if(marketKey === "h2h") {
              setMoneylinesData(gameDictParsed);
              setMoneylinesCSV(currentCSV);
            } else if (marketKey === "spreads") {
              setSpreadsData(gameDictParsed);
              setSpreadsCSV(currentCSV);
            } else if (marketKey === "totals") {
              setTotalsData(gameDictParsed);
              setTotalsCSV(currentCSV);
            } else{
              console.log("MARKET ERROR WHEN SETTING gameDictParsed in App.js")
            }
            setCurrentOddsData(gameDictParsed);


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
    pullAllCSV()
  }, []);

  useEffect(() => {
    if (typeof initTotals != "undefined"){
      setLoading(false)
      console.log("INIT TOTALS DONE")
      changeOddsSettings();
    }
  }, [initTotals]);


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
          // console.log("\t3.1 then => ", pullMkt)
          const gameDictParsed = JSON.parse(data); // data = gameDict
          
          if(pullMkt === "h2h") {
            // console.log("\t\t3.1a$  setting ML")
            setMoneylinesData(gameDictParsed);
            setCopyCSV(moneylinesCSV)
          } else if (pullMkt === "spreads") {
            // console.log("\t\t3.1b$  setting spr")
            setSpreadsData(gameDictParsed);
            setCopyCSV(spreadsCSV)
          } else if (pullMkt === "totals") {
            // console.log("\t\t3.1c$  setting tot")
            setTotalsData(gameDictParsed);
            setCopyCSV(totalsCSV)
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
    console.log('\tREQUESTS PULL...')
    try {
      await fetch("http://localhost:4000/oddsAPI/reqs")
      .then(res => res.text()).then(
      data => {
        const responseArr = JSON.parse(data); // data = [reqs]]
        // console.log('#. responseArr = ',responseArr)
        // console.log('#. responseArr typ = ',typeof responseArr)
        const reqsPulled = responseArr[0]; // data = [reqs]]
        // console.log('#. REQUESTS = ',reqsPulled)
        setRequestsUsed(reqsPulled)
      })
    } catch (err) {
        console.log(err.message)
        console.log("CATCH ERROR IN pullRequestsSaved function")
    }
  }

  async function pullAllCSV() {
    console.log('\tCSV PULL...')
    try {
      await fetch("http://localhost:4000/oddsAPI/pullcsv",{headers:{"market":"h2h",}})
      .then(res => res.text()).then(
        responseStr => {
          // console.log('#. pullcsv = ',responseStr)
          // console.log('#. responseStr typ = ',typeof responseStr)
          setMoneylinesCSV(responseStr)
      })
    } catch (err) {console.log("CATCH ERROR IN pullCSV function")}

    try {
      await fetch("http://localhost:4000/oddsAPI/pullcsv",{headers:{"market":"spreads",}})
      .then(res => res.text()).then(
        responseStr => {
          setCopyCSV(responseStr) // special
          setSpreadsCSV(responseStr)
      })
    } catch (err) {console.log("CATCH ERROR IN pullCSV function")}

    try {
      await fetch("http://localhost:4000/oddsAPI/pullcsv",{headers:{"market":"totals",}})
      .then(res => res.text()).then(
        responseStr => {
          setTotalsCSV(responseStr)
      })
    } catch (err) {console.log("CATCH ERROR IN pullCSV function")}
  }


  useEffect(() => {
    console.log('\n\nLOADING...\n')
    setLoading(true)
    
    changeOddsSettings();
    setTimeout(() => {
      setLoading(false)
      console.log('\n...DONE LOADING \n\n')
    },2000)
  }, [marketKey, sportKey]);


  function changeOddsSettings() {
    if (typeof initTotals == "undefined") {
      console.log("---KEY CHANGE ABORTED, STILL INIT")
    } else {
      console.log("5.   KEY CHANGE")
      // console.log("5. ",totalsData)

      var savedData;
      var currCSV;
      if (marketKey === "h2h"){
        console.log("\tSwitching to saved ML")
        savedData = moneylinesData
        currCSV = moneylinesCSV
      } else if (marketKey === "spreads"){
        console.log("\tSwitching to saved spreads")
        savedData = spreadsData
        currCSV = spreadsCSV
      } else if (marketKey === "totals"){
        console.log("\tSwitching to saved totals")
        savedData = totalsData
        currCSV = totalsCSV
      } else {
        console.log("BIGERROR no market defined in changed odds settings")
      }


      // console.log("\t5% savedData  ",savedData)

      setCopyCSV(currCSV)
      setCurrentOddsData(savedData)
      let ids = Object.keys(savedData)
      setGameIDs(ids);
      pullTracking(marketKey, ids)

    }
  }
  
  async function pullTracking(mkt, game_ids) {
    console.log('\tpulling tracking dict...',mkt)
    try {
    await fetch("http://localhost:4000/oddsAPI/pulltracking",{
      headers:{
        "market":mkt,
      }
    })
    .then(res => res.text()).then(
        data => {
        const trackingArrParsed = JSON.parse(data); // data = gameDict
        
        console.log("\n\n% Pulled trackingArr:")
        let updatedTrackArr = [] // delete past games
        for (let i=0; i < trackingArrParsed.length; i++) {
          if (game_ids.includes(trackingArrParsed[i])){
            updatedTrackArr.push(trackingArrParsed[i])
          } 
        }

        storeTracking(updatedTrackArr)
        setTrackIDs([...updatedTrackArr])
    })
    } catch (err) {
        console.log(err.message)
        console.log("CATCH ERROR IN pullTracking function")
    }
  }

  useEffect (() => {
    if (gameIDs && trackIDs) {
        let new_nontrack = []
        for (let i=0; i < gameIDs.length; i++) {
            let cur_id = gameIDs[i]
            if (trackIDs.includes(cur_id) === false)  {
                new_nontrack.push(cur_id)
            }
        }
        setNontrackIDs(new_nontrack)
    }
    // forceUpdateID()

  },[trackIDs, gameIDs])

  function toggleTrack(id) {
    let arr = trackIDs;
    if (arr.includes(id)){
      const idx = arr.indexOf(id);
      arr.splice(idx, 1); // 2nd parameter means remove one item only
      setTrackIDs([...arr])
    } else {
      arr.push(id)
      setTrackIDs([...arr])
    }
    storeTracking(arr)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  async function storeTracking(storeArr) {
    console.log('### STORING track arr...', marketKey)
    try {
      await fetch("http://localhost:4000/oddsAPI/storetracking",{
        method: "POST",
        headers: { 
          "arr" : JSON.stringify(storeArr) ,
          "market" : marketKey
        }
      })
      .then(res=>res.json())
    } catch (err) {
        console.log(err.message)
        console.log("CATCH ERROR IN storeTracking function")
    }
  }
  
  function handleCsvClick() {
    // let csv_text = "DAL,4.5,4\nWAS,-4.5,-4"
    navigator.clipboard.writeText(copyCSV)
    // console.log(copyCSV)
    // navigator.clipboard.writeText(csv_text)
    setCsvConfirmation(true)
    setTimeout(() => {
      setCsvConfirmation(false)
    }, 1000)
  }

  return (
    <div className="App">
      {loading ? (
        <Loading></Loading>
      ) : (
        <></>
      )}

      {csvConfirmation ? (
        <CsvConfirmation></CsvConfirmation>
      ) : (
        <></>
      )}
      
      

      <div id="main-content">
        <div id="fixedContainer">

          <div style={{height:"1em"}}></div>
          <h1>MY ODDS SCREEN :)</h1>

          <div id="buttonsContainer">
            <OddsTypeBar 
              changeMarket={setMarketKey} 
              changeSport={setSportKey} 
              setAllBooks={setAllBooks} 
              refreshOdds={refreshOdds}
              reqUsed={requestsUsed}
            ></OddsTypeBar>

            <button id="csvBtn" 
              onClick={handleCsvClick}
            >Copy CSV</button>
          </div>

          <OddsTableHeader myBooks={myBooks}></OddsTableHeader>

        </div>
        
        <OddsTable 
          currentOddsData={currentOddsData} 
          trackIDs={trackIDs} 
          nontrackIDs={nontrackIDs} 
          myBooks={myBooks}
          marketKey={marketKey}
          sportKey={sportKey}  
          toggleTrack={toggleTrack}
        ></OddsTable>

      </div>


      <div style={{height:"25em"}}></div>
      
    </div>
  );
}

export default App;



