import {useState, useEffect} from 'react';
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

function FullLineGraph({chartData}) {
    const timeData = chartData["times"]
    const oddsData = chartData["odds"]
        
    const options = {
        responsiveness: true,
        maintainAspectRatio: false,

        scales: {
            y: {

                beginAtZero: false,
                ticks: {
                    maxTicksLimit: 10,
                    stepSize: 0.5,
                    padding: 0,
                    autoSkip: false,
                    display: true,
                    callback: function(value, index, values) {
                        if (index === values.length - 1) {
                            let max = Math.max.apply(this, oddsData)
                            let max_rd = (Math.round(max * 2 + .49) / 2).toFixed(1)
                            return max_rd
                        }
                        else if (index === 0) {
                            let min = Math.min.apply(this, oddsData)
                            let min_rd = (Math.round(min * 2 - .49) / 2).toFixed(1)
                            return min_rd
                        }
                        else {
                            return ''
                        }
                    }
                },
                grid: {
                    color: "rgba(255,255,255,.5)",
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: false,
                    padding: 0,
                    lineWidth: .3,
                    tickColor: "aqua"

                }, 
                border: {display: false}
            },

            x: {
                // display: false,
                // ticks: {
                //     display: false
                // } ,
                type: 'time',
                time: {
                    unit: 'hour'
                }
            },
        }
    }

    const pointStyle = "circle"
    const tension = .1
    const pointBorderWidth = 0
    const spanGaps = true

    const mainPointBackgroundColor = "white"
    const mainBorderColor = 'rgba(200,230,255,.6)'
    const mainBorderWidth = 2
    const mainPointRadius = 1

    const bookPointStyle = "rect"
    const bookBorderWidth = 1
    const bookPointRadius = 3

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

            <Line options={options} data={data} id="fullLineGraph" />

    );
}
  
export default FullLineGraph;