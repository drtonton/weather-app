import React, { useState } from "react";
import axios from 'axios';


async function fetchCityMatches(cityName: string): Promise<string> {
  const url = `http://localhost:8001/city/?name=${cityName}`;
  console.log('url', url);
  const matched = await axios.get(url);
  console.log('matched', matched);
  return 'bro';
}

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
        fetchCityMatches(e.target.value);
        setInputValue(e.target.value);
      }}
      onFocus={() => setIsActive(true)}
    />
  );
}

export default LocationSearch;