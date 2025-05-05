import axios from "axios";

const API_URL = "https://restcountries.com/v3.1";

export const getAllCountries = async () => {
  const res = await axios.get(`${API_URL}/all`);
  return res.data;
};

export const searchCountryByName = async (name) => {
  const res = await axios.get(`${API_URL}/name/${name}`);
  return res.data[0];
};

export const getCountriesByRegion = async (region) => {
  const res = await axios.get(`${API_URL}/region/${region}`);
  return res.data;
};

export const getCountryByCode = async (code) => {
  const res = await axios.get(`${API_URL}/alpha/${code}`);
  return res.data[0];
};