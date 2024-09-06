// import './HoldBox.css';

function HoldBox({hold_arr, mkt}) {
    // hold_arr = [ hold%, lineDiff] - both strings, lineDiff for ML is ""
    // console.log("holdarr: ",hold_arr, "   typ: ",typeof hold_arr)
    let hold_value = hold_arr[0]
    let line_diff = hold_arr[1]


    // HOLD % COLOR
    let norm = (parseFloat(hold_value) + 2.5)/ 3
    let clip = Math.max(-1,Math.min(1, norm)) 

    let bg_color = "hsla(345,100%,50%,0)"
    if (clip === 0) {
        bg_color = "hsla(345,0%,100%,.07)"
    } else if (clip > 0) {
        let opacity = clip*.5 + .5 // remap 0-1 to .1-1
        let sat = clip*90 + 10
        bg_color = "hsla(155,"+sat+"%,35%,"+opacity+")"
    } else if (clip < 0) {
        let opacity = -clip*.9 + .1 // remap 0-1 to .1-1
        let sat = -clip*100
        bg_color = "hsla(345,"+sat+"%,45%,"+opacity+")"
    }


    // LINE DIFF COLOR
    let clip2= Math.min(line_diff/2.5, 1) 
    clip2 = clip2**1.5
    let bg_color2 = "hsla(220,90%,90%,.05)"
    if (clip2 > 0) {
        let opacity = clip2*.9 + .1 // remap 0-1 to .1-1
        let sat = clip2*50 + 50
        let light = clip2*15 + 33
        bg_color2 = "hsla(155,"+sat+"%,"+light+"%,"+opacity+")"
    } 

    return (
        <>
        
            <p 
                className={mkt === "h2h" ? "holdBoxHalf holdLeft holdHide" : "holdBoxHalf holdLeft"}
                style={{backgroundColor: bg_color2}}
            > 
                    {line_diff}
            </p>

            <p 
                className={mkt === "h2h" ? "holdBoxHalf holdRight holdML" : "holdBoxHalf holdLeft"} 
                style={{backgroundColor: bg_color}}
            >
                    {hold_value}
            </p>
        </>
    );
}
  
export default HoldBox;