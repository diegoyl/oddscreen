'use client';

import React, {useState, useEffect} from 'react';
import OddsTypeBar from '../components/OddsTypeBar';
import OddsTable from '../components/OddsTable';
import Loading from '../components/Loading';
import CsvConfirmation from '../components/CsvConfirmation';
import OddsTableHeader from '../components/OddsTableHeader';

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
];
const defaultSport = "americanfootball_nfl";
const defaultMarket = "spreads";

export default function Home() {
  var [currentOddsData, setCurrentOddsData] = useState();
  var [totalsData, setTotalsData] = useState();
  var [spreadsData, setSpreadsData] = useState();
  var [moneylinesData, setMoneylinesData] = useState();
  var [totalsCSV, setTotalsCSV] = useState();
  var [spreadsCSV, setSpreadsCSV] = useState();
  var [moneylinesCSV, setMoneylinesCSV] = useState();
  var [initTotals, setInitTotals] = useState();
  var [gameIDs, setGameIDs] = useState();
  var [trackIDs, setTrackIDs] = useState();
  var [nontrackIDs, setNontrackIDs] = useState();
  var [requestsUsed, setRequestsUsed] = useState();
  var [marketKey, setMarketKey] = useState(defaultMarket);
  var [sportKey, setSportKey] = useState(defaultSport);
  var [loading, setLoading] = useState(false);
  var [allBooks, setAllBooks] = useState(false);
  var [copyCSV, setCopyCSV] = useState();
  var [csvConfirmation, setCsvConfirmation] = useState(false);

  const [, updateIDstates] = React.useState();
  const forceUpdateID = React.useCallback(() => updateIDstates({}), []);

  var gameDictParsed: any = [];

  const refreshOdds = async () => {
    if (sportKey === undefined){setSportKey(defaultSport)}
    console.log("refreshing odds with headers: ",marketKey," | ",sportKey, " | ", allBooks)

    try {
        setLoading(true)
        fetch("/api/oddsAPI",{
          headers:{
            "markets":marketKey,
            "sport":sportKey,
            "allbooks":allBooks
          }
        }).then(res => res.json()).then(
          data => {
            console.log("\tDONE refreshing!")
            const json_parsed = data; // data = [gameDict, reqUsed, gamesCSV]
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
            console.log("gameDictParsed ",gameDictParsed)


            // get all game IDs
            var id_keys = Object.keys(gameDictParsed)
            setGameIDs(id_keys);
        })
    } catch (err) {
        console.log(err)
        setLoading(false)
    }
  }
  // END REFRESH ODDS

  useEffect(() => {
    console.log('1. UseEffect Initializing...')
    pullRequestsSaved()
    pullAllSaved().then(() =>{
      console.log('5. back to useeeffect')
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
        })
      })
    })
  }

  async function pullSavedGameDict(pullMkt: string) {
    console.log('3. pullSavedGameDict...',pullMkt)
    try {
      setLoading(true)
      await fetch("/api/oddsAPI/gamedict",{
        headers:{
          "market":pullMkt,
        }
      }).then(res => res.json()).then(
        data => {
          const gameDictParsed = data; // data = gameDict
          
          if(pullMkt === "h2h") {
            setMoneylinesData(gameDictParsed);
            setCopyCSV(moneylinesCSV)
          } else if (pullMkt === "spreads") {
            setSpreadsData(gameDictParsed);
            setCopyCSV(spreadsCSV)
          } else if (pullMkt === "totals") {
            setTotalsData(gameDictParsed);
            setCopyCSV(totalsCSV)
            setInitTotals(gameDictParsed);
          } else{console.log("pullMkt ERROR WHEN SETTING gameDictParsed in App.js")}
      })
    } catch (err) {
        console.log(err)
        console.log("CATCH ERROR IN pullSavedGameDict function")
    }
  }

  async function pullRequestsSaved() {
    console.log('\tREQUESTS PULL...')
    try {
      await fetch("/api/oddsAPI/reqs")
      .then(res => res.json()).then(
      data => {
        const responseArr = data; // data = [reqs]]
        const reqsPulled = responseArr[0]; // data = [reqs]]
        setRequestsUsed(reqsPulled)
      })
    } catch (err) {
        console.log("CATCH ERROR IN pullRequestsSaved function")
        setRequestsUsed(0)
    }
  }

  async function pullAllCSV() {
    console.log('\tCSV PULL...')
    try {
      await fetch("/api/oddsAPI/pullcsv",{headers:{"market":"h2h",}})
      .then(res => res.json()).then(
        responseStr => {
          setMoneylinesCSV(responseStr)
      })
    } catch (err) {console.log("CATCH ERROR IN pullCSV function")}

    try {
      await fetch("/api/oddsAPI/pullcsv",{headers:{"market":"spreads",}})
      .then(res => res.json()).then(
        responseStr => {
          setCopyCSV(responseStr) // special
          setSpreadsCSV(responseStr)
      })
    } catch (err) {console.log("CATCH ERROR IN pullCSV function")}

    try {
      await fetch("/api/oddsAPI/pullcsv",{headers:{"market":"totals",}})
      .then(res => res.json()).then(
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
    if (false) {
      console.log("---KEY CHANGE ABORTED, STILL INIT")
    } else {
      console.log("5.   KEY CHANGE")

      var savedData: any;
      var currCSV: any;
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

      setCopyCSV(currCSV)
      setCurrentOddsData(savedData)

      let ids: string[] = []
      try {
        ids = Object.keys(savedData)
      } catch {
        console.log("NO IDs in cahgne OddsSetting")
        console.log("\t",savedData)
      }
      setGameIDs(ids);
      pullTracking(marketKey, ids)

    }
  }
  
  async function pullTracking(mkt: string, game_ids: string[]) {
    console.log('\tpulling tracking dict...',mkt)
    try {
    await fetch("/api/oddsAPI/pulltracking",{
      headers:{
        "market":mkt,
      }
    })
    .then(res => res.json()).then(
        data => {
        const trackingArrParsed = data; // data = gameDict
        
        console.log("\n\n% Pulled trackingArr:")
        let updatedTrackArr: string[] = [] // delete past games
        for (let i=0; i < trackingArrParsed.length; i++) {
          if (game_ids.includes(trackingArrParsed[i])){
            updatedTrackArr.push(trackingArrParsed[i])
          } 
        }

        storeTracking(updatedTrackArr)
        setTrackIDs([...updatedTrackArr])
    })
    } catch (err) {
        console.log(err)
        console.log("CATCH ERROR IN pullTracking function")
        setTrackIDs([])
    }
  }

  useEffect (() => {
    console.log("new nontrack ids")
    console.log("\tGM: ",gameIDs)
    console.log("\tTR: ",trackIDs)
    if (gameIDs && trackIDs) {
        let new_nontrack: string[] = []
        for (let i=0; i < gameIDs.length; i++) {
            let cur_id = gameIDs[i]
            if (trackIDs.includes(cur_id) === false)  {
                new_nontrack.push(cur_id)
            }
        }
        setNontrackIDs(new_nontrack)
    }

  },[trackIDs, gameIDs])

  function toggleTrack(id: string) {
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

  async function storeTracking(storeArr: string[]) {
    console.log('### STORING track arr...', marketKey)
    try {
      await fetch("/api/oddsAPI/storetracking",{
        method: "POST",
        headers: { 
          "arr" : JSON.stringify(storeArr) ,
          "market" : marketKey
        }
      })
      .then(res=>res.json())
    } catch (err) {
        console.log(err)
        console.log("CATCH ERROR IN storeTracking function")
    }
  }
  
  function handleCsvClick() {
    navigator.clipboard.writeText(copyCSV)
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