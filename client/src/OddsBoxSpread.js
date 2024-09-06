import './GameComponent.css';

function OddsBoxSpread({book_id, odds, bestBooks1, bestBooks2}) {
    let spread1, spread2, odd1, odd2, cn1, cn2;
    if (odds === undefined){
        odd1 = <p className="split odd"></p>
        odd2 = <p className="split odd"></p>
        spread1 = <p className="split line">-</p>
        spread2 = <p className="split line">-</p>
    } else {
        if (bestBooks1 === undefined){bestBooks1 = []}
        if (bestBooks2 === undefined){bestBooks2 = []}
        cn1 = ""
        if (bestBooks1.includes(book_id)) {
            cn1 = " bestHighlight"
        }
        cn2 = ""
        if (bestBooks2.includes(book_id)) {
            cn2 = " bestHighlight"
        }

        spread1 = <p className="line split">{odds[2]}</p>
        odd1 = <p className="odd split">{odds[0]}</p>

        spread2 = <p className="line split">{odds[3]}</p>
        odd2 = <p className="odd split">{odds[1]}</p>
    }


    return (
        <div className="column c-book c-book-content">
            <div className={"splitContainer"+cn1}>
                {spread1}
                {odd1}
            </div>
            <div className={"splitContainer"+cn2}>
                {spread2}
                {odd2}
            </div>
        </div>
    );
}
  
export default OddsBoxSpread;