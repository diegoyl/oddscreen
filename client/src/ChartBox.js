import {useState, useEffect} from 'react';
import './ChartBox.css';
import LineGraph from './LineGraph.js';
import FullLineGraph from './FullLineGraph.js';


function ChartBox({chartData, curAvg}) {

    var [chartMax, setchartMax] = useState()
    var [chartMin, setchartMin] = useState()
    var [dirLineColor, setDirLineColor] = useState()
    var [dirPointColor, setDirPointColor] = useState()
    // var [oddsData, setOddsData] = useState()
    // var [dirChange, setDirChange] = useState()
    // var [average, setAverage] = useState()


    var oddsData = chartData["odds"]
    var dirChange = chartData["dirChange"]

    useEffect(() => {
        // console.log("\n\nUPDATING")

        // DEFAULTS
        var defMax = Math.round(curAvg*2)/2 + 0.5
        var defMin = Math.round(curAvg*2)/2 - 0.5
        
        // MIN MAX BOUNDS
        let odd_max = Math.max.apply(Math,oddsData)
        let max_rd = (Math.round(odd_max * 2 + .49) / 2).toFixed(1)
        const MAX_MAX = Math.max(defMax,max_rd)
    
        let odd_min = Math.min.apply(Math,oddsData)
        let min_rd = (Math.round(odd_min * 2 - .49) / 2).toFixed(1)
        const MIN_MIN = Math.min(defMin,min_rd)

        setchartMax(MAX_MAX)
        setchartMin(MIN_MIN)

        let newLineC = "hsla(0,0%,60%,.8)"
        let newPointC = "rgba(255,255,255,1)"

        // GRADIENT LINE COLOR
        if (dirChange > 0) {
            let s = Math.min(((dirChange*0.55)**0.3 + 0.2)*100, 100)  
            let o = Math.min(((dirChange*0.02)**0.4 + 0.8), 1)  
            newLineC = "hsla(150, "+s+"%, 50%, "+o+")"
        } else if (dirChange < 0){
            let s = Math.min(((-dirChange*0.55)**0.3 + 0.2)*100, 100)  
            let o = Math.min(((-dirChange*0.02)**0.4 + 0.8), 1)  
            newLineC = "hsla(340, "+s+"%, 50%, "+o+")"
        }
        setDirLineColor(newLineC)
        setDirPointColor(newPointC)
    },[chartData,curAvg])


    return (

        <div id="chartContainer">
            <div id="yLabels">
                <p id="yMax">{chartMax}</p>
                <p id="yAvg">{curAvg}</p>
                <p id="yMin">{chartMin}</p>
            </div>
            <div className="lineGraphContainer">
                <LineGraph 
                    chartData={chartData} 
                    chartMax={chartMax}
                    chartMin={chartMin}
                    dirLineColor={dirLineColor}
                    dirPointColor={dirPointColor}
                ></LineGraph>
            </div>
        </div>

    );
}
  
export default ChartBox;