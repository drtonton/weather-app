import React, { useState } from "react";
import axios from 'axios';

let timer: any;

// todo: prevent whitespace from being entered as first character in input

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
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState({});

  // API CALLS
  // todo: instead of any[], make a Type of the return shape and enforce it
  const fetchCityMatches = async (fieldInput: string): Promise<any[]> => {
    const url = `http://localhost:8001/city/?name=${fieldInput}`;
    const cities = await axios.get(url);
    return cities.data;
  }

  // todo: make a type for the weather data
  const fetchWeatherData = async (cityId: number): Promise<{}> => {
    const url = `http://localhost:8001/weather/?cityId=${cityId}`;
    const weatherData = await axios.get(url);
    console.log('weahter data', weatherData);
    return weatherData.data;
  }

  // HELPER FUNCTIONS
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

  const handleCitySelect = (city: City): void => {
    setSelectedCity(`${city.name}${city.state ? ', ' + city.state : ''}${city.country ? ' (' + city.country + ')' : ''}`);
    setMatchedCities([]);
    setInputValue('');
    setWeatherData(fetchWeatherData(city.id));
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
      <div className="searchResults">
        {inputValue !== '' && matchedCities.map(city => (
          <div key={city.id} onClick={() => handleCitySelect(city)}>
            {`${city.name}${city.state ? ', ' + city.state : ''}${city.country ? ' (' + city.country + ')' : ''}`}
          </div>
        ))}
      </div>
      <div className="weatherData">
        {selectedCity && (
          <div>Results for {selectedCity}</div>
        )}
      </div>
    </div>
    
    
  );
}

export default LocationSearch;
