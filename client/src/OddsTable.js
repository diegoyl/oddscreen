import './OddsTable.css';
import GameComponent from './GameComponent.js';
import {useState, useEffect} from 'react'
import Loading from './Loading.js';

function OddsTable({currentOddsData, trackIDs, nontrackIDs, myBooks, marketKey, sportKey, toggleTrack}) {
    var [loading, setLoading] = useState(false)
    var [initializing, setInitializing] = useState(true)
    var [wantDict, setWantDict] = useState()
    
    useEffect(() => {
        console.log("\tOddsTable populating wanted")
        console.log("\t\tcW: ",currentOddsData)
        console.log("\t\ttIDs: ",trackIDs)
        pullWantDict(marketKey)
    },[])
    


    async function pullWantDict(mkt) {
        console.log('\tpulling wanted dict...')
        try {
        await fetch("http://localhost:4000/oddsAPI/pullwantdict",{
            headers:{
              "market":mkt,
            }
        })
        .then(res => res.text()).then(
            data => {
            const wantDictParsed = JSON.parse(data); // data = gameDict
            
            console.log("\n\n% Pulled wantDict:")
            console.log(wantDictParsed)
            setWantDict(wantDictParsed)
            setInitializing(false)
        })
        } catch (err) {
            // console.log(err.message)
            console.log("CATCH ERROR IN pullWantedDict function: ")
            setWantDict({})
            setInitializing(false)
        }
    }




    function updateWantDict(newOdds, game_id) {
        if (initializing === true){
            console.log('initializing want dict')
        } else {
            console.log('NOT initializing want dict')
            setLoading(true)
            console.log("1. ",wantDict)
            wantDict[game_id] = newOdds
            console.log("2. ",wantDict)
    
            storeWantDict(wantDict, marketKey)
    
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    async function storeWantDict(wantDict, mkt) {
      console.log('### STORING WANT DICT...',mkt)
      console.log(wantDict)
      try {
        await fetch("http://localhost:4000/oddsAPI/wantdict",{
          method: "POST",
          headers: { "dict" : JSON.stringify(wantDict) , "market":mkt}
        })
        .then(res=>res.json())
      } catch (err) {
          console.log(err.message)
          console.log("CATCH ERROR IN storeWantDict function")
      }
    }
    
    return (
        
      <div id="oddsTableContainer">                    
        {loading ? (
            <Loading></Loading>
        ) : (
            <></>
        )}

        {/* <div>TRACKING</div> */}
        
        {(typeof currentOddsData === 'undefined' || !trackIDs ) ? (
            <p>Loading Games...</p>
            ): (
                <>
                {trackIDs.map(function(game_id) {
                    if (currentOddsData[game_id]) {
                        return (
                                <GameComponent key={game_id} 
                                game_id={game_id} 
                                oddsData={currentOddsData[game_id]} 
                                myBooks={myBooks}
                                marketKey={marketKey}
                                sportKey={sportKey}
                                updateWantDict={updateWantDict}
                                wantOdds={wantDict[game_id]}
                                toggleTrack={toggleTrack}
                                ></GameComponent>
                            )

                    }
                    }
                )}
                </>
            )
        }
        <div className="trackGap"></div>

        {(typeof currentOddsData === 'undefined' || !nontrackIDs ) ? (
            <p>Loading Games...</p>
            ): (
                <>

                {nontrackIDs.map(function(game_id) {
                    if (currentOddsData[game_id]) {
                        return (
                                <GameComponent key={game_id} 
                                game_id={game_id} 
                                oddsData={currentOddsData[game_id]} 
                                myBooks={myBooks}
                                marketKey={marketKey}
                                sportKey={sportKey}
                                updateWantDict={updateWantDict}
                                wantOdds={wantDict[game_id]}
                                toggleTrack={toggleTrack}
                                ></GameComponent>
                            )

                    }
                    }
                )}
                </>
            )
        }

        </div>
    );
}
  
export default OddsTable;