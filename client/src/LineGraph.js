import './ChartBox.css';
import {Line} from 'react-chartjs-2'  
import {Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement,
    LineElement,
    Tooltip,
    TimeScale

} from 'chart.js'

import {moment} from 'chartjs-adapter-moment';

ChartJS.register (
    CategoryScale, 
    LinearScale, 
    PointElement,
    LineElement,
    Tooltip,
    TimeScale
);
const gridColor = "rgba(255,255,255,.4)"
var gradientLineColor = "rgba(200,222,255,.5)"
var pointColor = "white"

function LineGraph({chartData, chartMax, chartMin, dirLineColor, dirPointColor}) {
    const timeData = chartData["times"]
    const oddsData = chartData["odds"]

    gradientLineColor = dirLineColor
    pointColor = dirPointColor

    // callback: function(value, index, values) {
    //     if (index === values.length - 1) {
    //         let max = Math.max.apply(this, oddsData)
    //         let max_rd = (Math.round(max * 2 + .49) / 2).toFixed(1)
    //         let max_max = Math.max(defaultMax,max_rd)
    //         setchartMax(max_max)
    //         return max_max
    //     }
    //     else if (index === 0) {
    //         let min = Math.min.apply(this, oddsData)
    //         let min_rd = (Math.round(min * 2 - .49) / 2).toFixed(1)
    //         let min_min = Math.max(defaultMin,min_rd)
    //         setchartMin(min_min)
    //         return min_min
    //     }
    //     else {
    //         return ''
    //     }
    // }

        
    const options = {
        responsiveness: true,
        maintainAspectRatio: false,

        scales: {
            y: {
                type: 'linear',
                max: chartMax,
                min: chartMin,
                // scaleFontSize: .4,
                beginAtZero: false,
                ticks: {
                    maxTicksLimit: 10,
                    // steps: 4,
                    stepSize: 0.5,
                    padding: 0,
                    autoSkip: false,
                    display: false,

                },
                grid: {
                    color: gridColor,
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: false,
                    padding: 0,
                    lineWidth: .2,
                    stepSize: 0.5,
                }, 
                border: {display: false}
            },

            x: {
                display: false,
                ticks: {
                    display: false
                } ,
                type: 'time',
                time: {
                    unit: 'minute'
                }
            },
        }
    }

    const pointStyle = "circle"
    const tension = .3
    const pointBorderWidth = 0
    const spanGaps = true

    const mainPointBackgroundColor = pointColor
    const mainBorderColor = gradientLineColor
    const mainBorderWidth = 2
    const mainPointRadius = 1

    // const bookPointStyle = "rect"
    // const bookBorderWidth = 1
    // const bookPointRadius = 3

    const data = {
        labels: timeData,

        datasets: [
            // {
            //     label: 'fd',
            //     data: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,-5],

            //     borderColor: 'rgb(0,140,250)',
            //     pointBackgroundColor: 'rgb(0,140,250)',

            //     pointStyle: bookPointStyle,
            //     tension: tension,
            //     pointBorderWidth: pointBorderWidth,
            //     spanGaps: spanGaps,
            //     borderWidth: bookBorderWidth,
            //     pointRadius: bookPointRadius,
            //     offset: true

            // },
            // {
            //     label: 'dk',
            //     data: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,-5.2],

            //     borderColor: 'rgb(120,200,50)',
            //     pointBackgroundColor: 'rgb(120,200,50)',

            //     pointStyle: bookPointStyle,
            //     tension: tension,
            //     pointBorderWidth: pointBorderWidth,
            //     spanGaps: spanGaps,
            //     borderWidth: bookBorderWidth,
            //     pointRadius: bookPointRadius
            // },
            // {
            //     label: 'mgm',
            //     data: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,-5.3],

            //     borderColor: 'rgb(200,140,100)',
            //     pointBackgroundColor: 'rgb(200,140,100)',

            //     pointStyle: bookPointStyle,
            //     tension: tension,
            //     pointBorderWidth: pointBorderWidth,
            //     spanGaps: spanGaps,
            //     borderWidth: bookBorderWidth,
            //     pointRadius: bookPointRadius
            // },

            {
                label: 'odds',
                data: oddsData,

                pointStyle: pointStyle,
                tension: tension,
                pointBorderWidth: pointBorderWidth,
                spanGaps: spanGaps,

                borderColor: mainBorderColor,
                pointBackgroundColor: mainPointBackgroundColor,

                borderWidth: mainBorderWidth,
                pointRadius: mainPointRadius,
            }
        ]
    }


    return (

            <Line options={options} data={data} id="lineGraph" />

    );
}
  
export default LineGraph;