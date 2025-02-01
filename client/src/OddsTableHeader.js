import './GameComponent.css';
import './OddsTableHeader.css';

const bookNames = {
    "betonlineag":"BOL",
    "fanduel":"FANDUEL",
    "draftkings":"DRAFTKINGS",
    "williamhill_us":"CAESARS",
    "betmgm":"BETMGM",
    "espnbet":"ESPNBET",
    "ballybet":"BALLY",
    "betrivers":"BETRIVERS",
    "fliff":"FLIFF"
    // "fanduel":"FanDuel",
    // "draftkings":"DraftKings",
    // "williamhill_us":"Caesars",
    // "betmgm":"BetMGM",
    // "espnbet":"ESPN Bet",
    // "ballybet":"Bally",
    // "betrivers":"BetRivers",
    // "fliff":"Fliff"
}

function OddsTableHeader({myBooks}) {
    return (
      <div className="fullTableRow" id='tableHeader'>
        <div className="column c-date">
        </div>
        <div className="column c-team">
        </div>
        <div className="column c-want">
            <p>WANT</p>
        </div>
        <div className="column c-best">
            <p>BEST</p>
        </div>
        <div className="column c-hold">
            <p>HOLD</p>
        </div>
        <div className="column c-chart">
            <p>CHART</p>
        </div>

        {myBooks.map(book_id => (
            <div key={book_id} id={book_id} className="column c-book">
                <p >{bookNames[book_id]}</p>
            </div>
        ))}

      </div>
    );
}
  
export default OddsTableHeader;