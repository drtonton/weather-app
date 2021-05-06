import React, { useState } from "react";

function LocationSearch() {
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  
  return (
    <input
      className={`input ${isActive && inputValue !== '' && 'active'}`}
      id='locationInput'
      type='text'
      value={inputValue}
      placeholder='City name'
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onFocus={() => setIsActive(true)}
    />
  );
}

export default LocationSearch;