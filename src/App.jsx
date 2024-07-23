// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LineChartGHG from './components/LineChartGHG';

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [listCountries, setListCountries] = useState([])
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/countries');
        setListCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCountry) {
        const response = await axios.get(`http://localhost:8081/api/emissions/aggregate?country=${selectedCountry}`);
        setData(response.data);
      }
    };
    fetchData();
  }, [selectedCountry]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Greenhouse Gas Emissions Over Time
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="country-select-label">Country</InputLabel>
        <Select
          labelId="country-select-label"
          value={selectedCountry}
          label="Country"
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {listCountries.map((countries) => (
            <MenuItem key={countries.shortName} value={countries.shortName}>
              {countries.countryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {data.length > 0 && (
        <>
          <Typography variant="h6">CO2 Emissions</Typography>
          <LineChartGHG data={data} gasType="totalCO2" />
          <Typography variant="h6">FGas Emissions</Typography>
          <LineChartGHG data={data} gasType="totalFGas" />
          <Typography variant="h6">N2O Emissions</Typography>
          <LineChartGHG data={data} gasType="totalN2O" />
          <Typography variant="h6">CH4 Emissions</Typography>
          <LineChartGHG data={data} gasType="totalCH4" />
        </>
      )}
    </Container>
  );
};

export default App;
