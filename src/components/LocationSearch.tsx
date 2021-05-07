import React, { useState } from "react";
import axios from 'axios';

let timerId: any;

async function fetchCityMatches(cityName: string): Promise<undefined> {
  const url = `http://localhost:8001/city/?name=${cityName}`;
  await axios.get(url);
  return;
}

// function throttler(func: Function, funcArg: string, delay: number) {
//   if (timerId) return;
//   timerId = setTimeout(() => {
//     func(funcArg);
//     timerId = undefined;
//   }, delay);
// }

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
          // throttler(fetchCityMatches, e.target.value, 500);
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
