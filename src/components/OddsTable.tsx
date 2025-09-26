import './OddsTable.css';

export default function OddsTable({ currentOddsData, trackIDs, nontrackIDs, myBooks, marketKey, sportKey, toggleTrack }: any) {
  return (
    <div id="oddsTableContainer">
      <h3>Odds Table (Placeholder)</h3>
      <p>Market: {marketKey}</p>
      <p>Sport: {sportKey}</p>
      <p>Tracked Games: {trackIDs?.length || 0}</p>
      <p>Non-tracked Games: {nontrackIDs?.length || 0}</p>
      <p>Current Data: {currentOddsData ? "Loaded" : "Not loaded"}</p>
    </div>
  );
}
