import React, { useState } from "react";
import axios from 'axios';

let timerId: any;

function fetchCityMatches(cityName: string): void {
  const url = `http://localhost:8001/city/?name=${cityName}`;
  axios.get(url);
  return;
}

function throttledCitySearch(searchValue: string): void {
  if (timerId) return;
  timerId = setTimeout(async() => {
    await fetchCityMatches(searchValue);
    timerId = undefined;
  }, 500);
}

function LocationSearch() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className='fieldWrapper'>
      <input
        className='fieldInput'
        id='locationInput'
        type='text'
        value={inputValue}
        onChange={(e) => {
          throttledCitySearch(e.target.value);
          setInputValue(e.target.value);
        }}
      />
      <label className='fieldLabel'>
        City name
      </label>
    </div>
    
  );
}

export default LocationSearch;
