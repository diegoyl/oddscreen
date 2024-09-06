import './GameComponent.css';

function OddsBoxH2H({book_id, odds, bestBooks1, bestBooks2}) {
    let odd1, odd2;
    if (odds === undefined){
        odd1 = <p>-</p>
        odd2 = <p>-</p>
    } else {
        if (bestBooks1 === undefined){
            bestBooks1 = []
        }
        if (bestBooks2 === undefined){
            bestBooks2 = []
        }
        let cn1 = ""
        if (bestBooks1.includes(book_id)) {
            cn1 = "bestHighlight"
        }
        let cn2 = ""
        if (bestBooks2.includes(book_id)) {
            cn2 = "bestHighlight"
        }
        odd1 = <p className={cn1}>{odds[0]}</p>
        odd2 = <p  className={cn2}>{odds[1]}</p>
    }



    return (
        <>
            {odd1}
            {odd2}
        </>
    );
}
  
export default OddsBoxH2H;