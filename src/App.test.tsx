import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

let locationInput;

beforeEach(() => {
  render(<App />);
  locationInput = screen.getByTestId('location-input-test');
});

describe('Rendering the empty state', () => {
  test('renders location input', () => {
    const inputLabelText = screen.getByTestId('location-input-label-test');
    const inputPlaceholderText = screen.getByPlaceholderText('type here');
    expect(inputLabelText).toBeInTheDocument();
    expect(inputPlaceholderText).toBeInTheDocument();
  });
})

describe('Using the location search input', () => {
  test('whitespace shouldn\'t be valid as the first character entered', () => {
    userEvent.type(locationInput, '');
    expect(locationInput).toHaveValue('');
    userEvent.type(locationInput, 'Africa');
    expect(locationInput).not.toHaveValue('');
    expect(locationInput).toHaveValue('Africa');
  });

  test('whitespace should be fine after a different character is entered', () => {
    userEvent.type(locationInput, 'a');
    userEvent.type(locationInput, ' ');
    userEvent.type(locationInput, 'b');
    expect(locationInput).toHaveValue('a b');
  });

  test('if an entry renders no search results, display (no results) in the dropdown', async () => {
    userEvent.type(locationInput, 'obviously not a real place');
    const noResultsIndicator = await screen.findByText('(no results)');
    expect(noResultsIndicator).toBeInTheDocument();
  });

  test('if an entry likely contains many results, only display 10 at a time', async () => {
    userEvent.type(locationInput, 'A');
    const results = await screen.findAllByTestId('city-option-test');
    expect(results.length).toBe(10);
  });

  test('if a unique city name is entered, only display that city', async () => {
    userEvent.type(locationInput, 'Istanbul');
    const results = await screen.findAllByTestId('city-option-test');
    expect(results.length).toBe(1);
  });
})

describe('Inspecting weather data', () => {
  test('clicking a result should display various weather-data points', async () => {
    userEvent.type(locationInput, 'Istanbul');
    const result = await screen.findByTestId('city-option-test');
    userEvent.click(result);
    const generalInfo = await screen.findByTestId('general-info-test');
    const locationName = await screen.findByTestId('location-name-test');
    const description = await screen.findByTestId('description-test');
    expect(generalInfo).toBeInTheDocument();
    expect(locationName).toBeInTheDocument();
    expect(locationName).toHaveTextContent('Istanbul (TR)');
    expect(description).toBeInTheDocument();
  });

  test('temperature data should be defaulted to °F and toggle to °C when clicked', async () => {
    userEvent.type(locationInput, 'Istanbul');
    const result = await screen.findByTestId('city-option-test');
    userEvent.click(result);

    const firstTempValue = await screen.findByTestId('temp-value-test');
    const fahrenheitTemp = firstTempValue.innerText;
    const tempScale = await screen.findByTestId('temp-scale-test');
    expect(tempScale).toHaveTextContent('°F');
    // click and change to celsius...
    userEvent.click(tempScale);
    expect(tempScale).toHaveTextContent('°C');
    // observe that the temperature values changed along with scale...
    const celsiusTempValue = await screen.findByTestId('temp-value-test');
    expect(celsiusTempValue.innerHTML).not.toEqual(fahrenheitTemp);
  });

  test('weather data should be hidden when search results are present', async () => {
    userEvent.type(locationInput, 'Istanbul');
    const result = await screen.findByTestId('city-option-test');
    userEvent.click(result);

    const weatherDataContainer = await screen.findByTestId('weather-data-test');
    expect(weatherDataContainer).toBeInTheDocument();

    userEvent.type(locationInput, 'Istanbul');
    await screen.findByTestId('city-option-test');
    expect(weatherDataContainer).not.toBeInTheDocument();
  });
})
  
