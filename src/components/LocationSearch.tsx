import React, { useState } from 'react';
import axios from 'axios';

import { City, WeatherData } from '../common/types';

let timer: any;

function LocationSearch() {
  // === STATE DECLARATIONS === //
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
  const [isCityDataLoading, setIsCityDataLoading] = useState<boolean>(false);
  const [displayNoCityResults, setDisplayNoCityResults] = useState<boolean>(false);

  // === OTHER VARIABLES / FUNCTIONS === //
  const fetchCityMatches = async (fieldInput: string): Promise<City[]> => {
    const url = `http://localhost:8001/city/?name=${fieldInput}`;
    const cities = await axios.get(url);
    return cities.data;
  }

  const fetchWeatherData = async (cityId: number): Promise<WeatherData> => {
    const url = `http://localhost:8001/weather/?cityId=${cityId}`;
    const weatherData = await axios.get(url);
    return weatherData.data;
  }

  const throttledCitySearch = (searchValue: string): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async() => {
      setIsCityDataLoading(true);
      const matched = await fetchCityMatches(searchValue);
      setIsCityDataLoading(false);
      setMatchedCities(matched);
      if (matched.length === 0) {
        setDisplayNoCityResults(true);
      } else {
        setDisplayNoCityResults(false);
      }
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
          autoComplete="off"
          id='locationInput'
          type='text'
          placeholder='type here'
          value={inputValue}
          onChange={(e) => {
            throttledCitySearch(e.target.value);
            setInputValue(e.target.value);
          }}
        />
        <label className='fieldLabel'>
          City Name (case sensitive)
        </label>
      </div>
      <div className='resultsContainer'>
        {matchedCities.length !== 0 && inputValue !== '' && (
          <div className='searchResults'>
          {matchedCities.map(city => (
            <div className="cityOption" key={city.id} onClick={() => handleCitySelect(city)}>
              {`${city.name}${city.state ? ', ' + city.state : ''}${city.country ? ' (' + city.country + ')' : ''}`}
            </div>
          ))}
        </div>
        )}
        {displayNoCityResults && !isCityDataLoading && (
          <div className='searchResults'>
            <div className="cityOption">(no results)</div>
          </div>
        )}
        {(matchedCities.length === 0 || inputValue === '') && displayWeatherData  && !displayNoCityResults && (
          <div className='weatherData'>
            <div className='temperatureData'>
              <img alt='default' src={weatherData.descriptionIconUrl} width='60' height='60'></img>
              <div className='temperatureValue'>{isFahrenheit ? weatherData.currentTempFahr : weatherData.currentTempCels}</div>
              <div className='temperatureScale' onClick={() => setIsFahrenheit(!isFahrenheit)}>
                <div className={isFahrenheit ? 'selectedScale' : ''}>°F</div>
                <div>|</div>
                <div className={!isFahrenheit ? 'selectedScale' : ''}>°C</div>
              </div>
            </div>
            <div className='generalInfo'>
              <div>{selectedCity}</div>
              <div>{weatherData.generalDescription}</div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    
  );
}

export default LocationSearch;
