// SportDropdown.js
import { useState, useEffect } from 'react';
import './OddsTypeBar.css'; // Import the CSS file for styling

function SportDropdown({changeSport}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  
  let dropdownClasses = 'dropdown-button';
  if (isOpen) {
    dropdownClasses = 'dropdown-button openShadow';
  } else {
    dropdownClasses = 'dropdown-button';
  }



  const handleItemClick = (sportItem) => {
    setIsOpen(false); // Close the dropdown on item click
    if (sportItem != selectedSport){
        setSelectedSport(sportItem); // Close the dropdown on item click
        let sportCode = sportName2Code[sportItem]
        changeSport(sportCode)
    }
  };

  useEffect(() => {
    setSelectedSport("NFL")
  },[])

  return (
    <div className="dropdown">
      <button className={dropdownClasses} onClick={toggleDropdown} >
        {selectedSport} ↓   
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => handleItemClick('NFL')}>NFL</li>
          <li onClick={() => handleItemClick('NFL Pre')}>NFL Pre</li>
          <li onClick={() => handleItemClick('NCAAF')}>NCAAF</li>
          <li onClick={() => handleItemClick('MLB')}>MLB</li>
          <li onClick={() => handleItemClick('NBA')}>NBA</li>
          <li onClick={() => handleItemClick('WNBA')}>WNBA</li>
          <li onClick={() => handleItemClick('NCAAM')}>NCAAM</li>
        </ul>
      )}
    </div>
  );
}

const sportName2Code = {
    "NFL":"americanfootball_nfl",
    "NFL Pre":"americanfootball_nfl_preseason",
    "NCAAF":"americanfootball_ncaaf",
    "MLB":"baseball_mlb",
    "NBA":"basketball_nba",
    "WNBA":"basketball_wnba",
    "NCAAM":"basketball_ncaab",
}
export default SportDropdown;