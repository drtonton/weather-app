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

  return (
    <div className='fieldWrapper'>
      <input
        className='fieldInput'
        id='locationInput'
        type='text'
        value={inputValue}
        onChange={(e) => {
          fetchCityMatches(e.target.value);
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