import {useState, useEffect} from 'react';
import './ChartBox.css';
import LineGraph from './LineGraph.js';
// import FullLineGraph from './FullLineGraph.js';


function ChartBox({chartData, curAvg, home, away}) {

    var [chartMax, setchartMax] = useState()
    var [chartMin, setchartMin] = useState()
    var [dirLineColor, setDirLineColor] = useState()
    var [dirPointColor, setDirPointColor] = useState()
    // var [oddsData, setOddsData] = useState()
    // var [dirChange, setDirChange] = useState()
    // var [average, setAverage] = useState()


    var oddsData = chartData["odds"]
    var dirChange = chartData["dirChange"]

    const hsl_dict = {
        'ARI' : [346, 87.3, 50.8],
        'ATL' : [350, 84.2, 44.7],
        'BAL' : [248, 73, 54.9],
        'BUF' : [218, 99.2, 47.3],
        'CAR' : [200, 100, 59],
        'CHI' : [20, 84.2, 50],
        'CIN' : [15, 98, 54],
        'CLE' : [22, 65, 30],
        'DAL' : [183, 20, 60],
        'DEN' : [21, 100, 54.7],
        'DET' : [196, 88.6, 48.2],
        'GB' : [155, 100, 22.5],
        'HOU' : [350, 75, 42.4],
        'IND' : [212, 100, 40.4],
        'JAC' : [186, 98, 35],
        'KC' : [351, 80.9, 49.2],
        'LAC' : [203, 100, 66.3],
        'LAR' : [217, 100, 53.7],
        'LV' : [198, 5.9, 66.7],
        'MIA' : [180, 70, 57],
        'MIN' : [267, 65, 50],
        'NE' : [348, 88.6, 41.2],
        'NO' : [44, 48, 66],
        'NYG' : [224, 75, 52.9],
        'NYJ' : [160, 78.4, 29],
        'PHI' : [177, 100, 25],
        'PIT' : [45, 100, 57],
        'SEA' : [95, 72, 49],
        'SF' : [42, 55, 60],
        'TB' : [28, 15, 40],
        'TEN' : [206, 97, 68],
        'WAS' : [340, 86, 28]
    }


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
        
        const leanThreshold = .5
        let new_o = 20
        
        // let changeScale = (Math.abs(dirChange)*15)**2 // SCALING
        let changeScale = 0 // SCALING
        let pre_h = 0
        let pre_s = 0
        let pre_l = 99  

        if (Math.abs(dirChange) > leanThreshold) {
            changeScale = 1
            new_o = 100

    
            if (dirChange <= 0) { 
                pre_h = hsl_dict[home][0]
                pre_s = hsl_dict[home][1]
                pre_l = hsl_dict[home][2]
            } else if (dirChange > 0){
                pre_h = hsl_dict[away][0]
                pre_s = hsl_dict[away][1]
                pre_l = hsl_dict[away][2]
            }
        }


        let new_h = pre_h
        let new_s = Math.max(pre_s * changeScale, 0)  // average to Zero
        let new_l = 99 - Math.min((100 - pre_l)*changeScale, 100 - pre_l)  // average to 100


        newLineC = "hsla("+new_h+", "+new_s+"%, "+new_l+"%, "+new_o+"%)"

        setDirLineColor(newLineC)
        setDirPointColor(newPointC)
    },[chartData,curAvg])


    return (

        <div id="chartContainer">
            <div id="yLabels">
                <p id="yMax">{chartMax}</p>
                {/* <p id="yAvg">{curAvg}</p> */}
                <p id="yAvg">{dirChange}</p>
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