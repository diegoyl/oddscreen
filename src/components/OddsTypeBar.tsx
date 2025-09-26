import './OddsTypeBar.css';

export default function OddsTypeBar({ changeMarket, changeSport, setAllBooks, refreshOdds, reqUsed }: any) {
  return (
    <div id="oddsTypeContainer">
      <button id="btn-h2h" onClick={() => changeMarket("h2h")}>ML</button>
      <button id="btn-spreads" onClick={() => changeMarket("spreads")}>SPR</button>
      <button id="btn-totals" onClick={() => changeMarket("totals")}>TOT</button>
      
      <button id="books-btn" onClick={() => setAllBooks(!setAllBooks)}>All Books</button>
      
      <button id="refresh-btn" onClick={refreshOdds}>↻</button>
      
      <div id="reqContainer">
        <p className="reqP" id="reqTitle">REQUESTS</p>
        <p className="reqP" id="reqUsed">{reqUsed || 0}</p>
      </div>
    </div>
  );
}
