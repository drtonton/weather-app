export interface City {
  id: number;
  name: string;
  state: string;
  country: string;
}

export interface WeatherData {
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