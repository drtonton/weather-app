import React, { useState } from "react";
import axios from 'axios';

let timer: any;

// todo: needs to go in a type file
type City = {
  id: number;
  name: string;
  state: string;
  country: string;
}

function LocationSearch() {
  const [inputValue, setInputValue] = useState('');
  const [matchedCities, setMatchedCities] = useState<City[]>([]);

  const throttledCitySearch = (searchValue: string): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async() => {
      const matched = await fetchCityMatches(searchValue);
      setMatchedCities(matched);
      timer = undefined;
    }, 500);
  }

  // todo: instead of any[], make a Type of the return shape and enforce it
  const fetchCityMatches = async (cityName: string): Promise<any[]> => {
    console.log('fetching: ', cityName);
    const url = `http://localhost:8001/city/?name=${cityName}`;
    const cities = await axios.get(url);
    return cities.data;
  }

  return (
    <div>
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
      <div>
        {inputValue !== '' && matchedCities.map(city => (
          <div key={city.id}>
            {`${city.name}${city.state ? ', ' + city.state : ''}${city.country ? ' (' + city.country + ')' : ''}`}
          </div>
        ))}
      </div>
    </div>
    
    
  );
}

export default LocationSearch;


/*
-> type char
-> function is invoked
-> timer is 1
-> after timer expires -> fetch
-> 
*/