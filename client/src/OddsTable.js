import './OddsTable.css';
import GameComponent from './GameComponent.js';
import OddsTableHeader from './OddsTableHeader.js';
import {useState, useEffect} from 'react'
import Loading from './Loading.js';

function OddsTable({currentOddsData, gameIDs, myBooks, marketKey, sportKey}) {
    var [loading, setLoading] = useState(false)
    var [initializing, setInitializing] = useState(true)
    var [wantDict, setWantDict] = useState()

    useEffect(() => {
        console.log("....populating wanted")
        pullWantDict()
    },[])

    async function pullWantDict() {
        console.log('%. pulling wanted dict...')
        try {
        await fetch("http://localhost:4000/oddsAPI/pullwantdict",{})
        .then(res => res.text()).then(
            data => {
            const wantDictParsed = JSON.parse(data); // data = gameDict
            
            console.log("\n\n% Pulled wantDict:")
            console.log(wantDictParsed)
            setWantDict(wantDictParsed)
            setInitializing(false)
        })
        } catch (err) {
            console.log(err.message)
            console.log("CATCH ERROR IN pullWantedDict function")
        }
    }



    function updateWantDict(newOdds, game_id) {
        if (initializing == true){
            console.log('initializing want dict')
        } else {
            console.log('NOT initializing want dict')
            setLoading(true)
            console.log("1. ",wantDict)
            wantDict[game_id] = newOdds
            console.log("2. ",wantDict)
    
            storeWantDict(wantDict)
    
            setTimeout(() => {
                setLoading(false)
            }, 300)
        }
    }

    async function storeWantDict(wantDict) {
      console.log('### STORING WANT DICT...')
      console.log(wantDict)
      try {
        await fetch("http://localhost:4000/oddsAPI/wantdict",{
          method: "POST",
          headers: { "dict" : JSON.stringify(wantDict) }
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

        <OddsTableHeader myBooks={myBooks}></OddsTableHeader>
        
        {(typeof currentOddsData === 'undefined' || Object.keys(currentOddsData).length < 1 ) ? (
            <p>Loading Games...</p>
            ): (
                <>
                {gameIDs.map(game_id => (
                    <GameComponent key={game_id} 
                    game_id={game_id} 
                    oddsData={currentOddsData[game_id]} 
                    myBooks={myBooks}
                    marketKey={marketKey}
                    sportKey={sportKey}
                    updateWantDict={updateWantDict}
                    wantOdds={wantDict[game_id]}
                    ></GameComponent>
                ))}
                </>
            )
        }

        </div>
    );
}
  
export default OddsTable;