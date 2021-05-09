import React, { useState } from 'react';
import axios from 'axios';

let timer: any;

// todo: prevent whitespace from being entered as first character in input

// todo: needs to go in a type file
interface City {
  id: number;
  name: string;
  state: string;
  country: string;
}

interface WeatherData {
  generalDescription: string;
  descriptionIconUrl: string;
  hiTempFahr: any;
  loTempFahr: any;
  feelsLikeFahr: any;
  currentTempFahr: any;
  hiTempCels: any;
  loTempCels: any;
  feelsLikeCels: any;
  currentTempCels: any;
}

function LocationSearch() {
  const [inputValue, setInputValue] = useState('');
  const [matchedCities, setMatchedCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData>({
    generalDescription: '',
    descriptionIconUrl: '',
    hiTempFahr: undefined,
    loTempFahr: undefined,
    feelsLikeFahr: undefined,
    currentTempFahr: undefined,
    hiTempCels: undefined,
    loTempCels: undefined,
    feelsLikeCels: undefined,
    currentTempCels: undefined
  });
  const [displayWeatherData, setDisplayWeatherData] = useState<boolean>(false);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(true);

  // API CALLS
  // todo: instead of any[], make a Type of the return shape and enforce it
  const fetchCityMatches = async (fieldInput: string): Promise<any[]> => {
    const url = `http://localhost:8001/city/?name=${fieldInput}`;
    const cities = await axios.get(url);
    return cities.data;
  }

  // todo: make a type for the weather data
  const fetchWeatherData = async (cityId: number): Promise<WeatherData> => {
    const url = `http://localhost:8001/weather/?cityId=${cityId}`;
    const weatherData = await axios.get(url);
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

  const handleCitySelect = async (city: City): Promise<void> => {
    setSelectedCity(`${city.name}${city.state ? ', ' + city.state : ''}${city.country ? ' (' + city.country + ')' : ''}`);
    setMatchedCities([]);
    setInputValue('');
    setWeatherData(await fetchWeatherData(city.id));
    setDisplayWeatherData(true);
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
          City name (case sensitive)
        </label>
      </div>
      <div className='resultsContainer'>
        <div className='weatherData'>
          {/* todo: use a loader here instead */}
          {displayWeatherData && (
            <div>
              <div className='temperatureData'>
                <div>{isFahrenheit ? weatherData.currentTempFahr : weatherData.currentTempCels}</div>
                {/* <div onClick={() => setIsFahrenheit(!isFahrenheit)}>{isFahrenheit ? '°F' : '°C'}</div> */}
                <div className='temperatureScale' onClick={() => setIsFahrenheit(!isFahrenheit)}>
                  <div className={isFahrenheit ? 'selectedScale' : ''}>°F</div>
                  <div>|</div>
                  <div className={!isFahrenheit ? 'selectedScale' : ''}>°C</div>
                </div>
              </div>
              <div className='generalInfo'>
                <div>{selectedCity}</div>
                <div>{weatherData.generalDescription}</div>
                <img alt='default' src={weatherData.descriptionIconUrl} width='60' height='60'></img>
              </div>
            </div>
          )}
        </div>
        <div className='searchResults'>
          {inputValue !== '' && matchedCities.map(city => (
            <div className="cityOption" key={city.id} onClick={() => handleCitySelect(city)}>
              {`${city.name}${city.state ? ', ' + city.state : ''}${city.country ? ' (' + city.country + ')' : ''}`}
            </div>
          ))}
        </div>
      </div>
    </div>
    
    
  );
}

export default LocationSearch;

// interface WeatherData {
//   generalDescription: string;
//   descriptionIconUrl: string;
//   hiTempFahr: number;
//   loTempFahr: number;
//   feelsLikeFahr: number;
//   currentTempFahr: number;
//   hiTempCels: number;
//   loTempCels: number;
//   feelsLikeCels: number;
//   currentTempCels: number;
// }