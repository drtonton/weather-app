import React, { useState } from "react";
import axios from 'axios';

let timerId: any;

interface City {
  name: string;
}

// function fetchCityMatches(cityName: string): void {
//   const url = `http://localhost:8001/city/?name=${cityName}`;
//   axios.get(url);
// }

// function throttledCitySearch(searchValue: string): void {
//   if (timerId) return;
//   timerId = setTimeout(async() => {
//     await fetchCityMatches(searchValue);
//     timerId = undefined;
//   }, 500);
// }

function LocationSearch() {
  const [inputValue, setInputValue] = useState('');
  const [matchedCities, setMatchedCities] = useState([]);

  const throttledCitySearch = (searchValue: string): string | undefined => {
    if (timerId) return;
    timerId = setTimeout(async() => {
      const matched = await fetchCityMatches(searchValue);
      console.log('matched', matched);
      // setMatchedCities(matched);
      timerId = undefined;
      return 'bro';
    }, 100);
  }

  // todo: instead of any[], make a Type of the return shape and enforce it
  const fetchCityMatches = async (cityName: string): Promise<any[]> => {
    const url = `http://localhost:8001/city/?name=${cityName}`;
    const cities = await axios.get(url);
    return cities.data;
  }

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
