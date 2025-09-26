import './OddsTableHeader.css';

export default function OddsTableHeader({ myBooks }: any) {
  return (
    <div id="tableHeader">
      <div className="column c-team">
        <p>TEAM</p>
      </div>
      {myBooks?.map((book: string) => (
        <div key={book} className="column" id={book}>
          <p>{book.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
}
