import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  CircularProgress,
  useMediaQuery,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';
import LineChartGHGApex from "./components/LIneChartGHGApex";
import GroupBarSectorApex from './components/GroupBarSectorApex';
import "leaflet/dist/leaflet.css";
import MapComponent from './components/MapComponent';

const countryCoordinates = [
  { shortName: "BRA", latitude: -15.7801, longitude: -47.9292 },
  { shortName: "IND", latitude: 28.6139, longitude: 77.2090 },
  { shortName: "CHN", latitude: 39.9042, longitude: 116.4074 },
  { shortName: "IDN", latitude: -6.2088, longitude: 106.8456 },
  { shortName: "EUU", latitude: 50.8503, longitude: 4.3517 },
  { shortName: "USA", latitude: 38.8951, longitude: -77.0364 },
  { shortName: "IRN", latitude: 35.6892, longitude: 51.3890 },
  { shortName: "JPN", latitude: 35.6762, longitude: 139.6503 },
  { shortName: "KOR", latitude: 37.5665, longitude: 126.9780 },
  { shortName: "RUS", latitude: 55.7558, longitude: 37.6173 }
];

const App = () => {
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [data, setData] = useState([]);
  const [dataBar, setDataBar] = useState([]);
  const [allMapData, setAllMapData] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();

  const showErrors = useCallback(() => {
    if (errors.length > 0) {
      Swal.fire({
        title: 'Error',
        html: errors.join('<br>'),
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect to 404 page if critical data is missing
        if (errors.some(error => error.includes('countries') || error.includes('years'))) {
          navigate('/error', { state: { status: 503, message: "Unable to connect to the server. Please try again later." } });
        }
      });
    }
  }, [errors, navigate]);

  const addError = useCallback((errorMessage) => {
    setErrors(prevErrors => [...prevErrors, errorMessage]);
  }, []);


  const renderChart = (ChartComponent, chartData, isLineChart = false) => (
    <Box
      sx={{
        width: isMobile ? '100%' : 'auto',
        overflowX: isMobile ? 'auto' : 'visible',
        '&::-webkit-scrollbar': {
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[300],
          borderRadius: '4px',
        },
      }}
    >
      <Box
        sx={{
          minWidth: isMobile ? '600px' : 'auto',
          height: '100%',
        }}
      >
        <ChartComponent
          data={chartData}
          hideLegend={isLineChart && isMobile}
        />
      </Box>
    </Box>
  );

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/countries');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      addError('Error fetching countries');
    }
  }, [addError]);

  const fetchYears = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/emissions/years');
      setYears(response.data);
    } catch (error) {
      console.error('Error fetching years:', error);
      addError('Error fetching years');
    }
  }, [addError]);

  const fetchData = useCallback(async (countryCodes) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/emissions/aggregateCountry?countries=${countryCodes}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching emissions data:', error);
      addError('Error fetching emissions data');
    } finally {
      setLoading(false);
    }
  }, [addError]);

  const fetchDataBar = useCallback(async (year) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/emissions/aggregateSectorbyYear?year=${year}`);
      setDataBar(response.data);
    } catch (error) {
      console.error('Error fetching dataBar:', error);
      addError('Error fetching sector data');
    }
  }, [addError]);

  const fetchAllMapData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/emissions/aggregateMapAll');
      setAllMapData(response.data);
    } catch (error) {
      console.error('Error fetching all map data:', error);
      addError('Error fetching map data');
    }
  }, [addError]);

  const filteredMapData = useMemo(() => {
    if (!selectedYear) return [];

    return countryCoordinates.map(country => {
      const countryData = allMapData.find(d => d.shortName === country.shortName && d.year === parseInt(selectedYear));
      return {
        ...country,
        emissions: countryData?.emissions || {},
        countryName: countryData?.name || country.shortName,
        year: selectedYear
      };
    });
  }, [allMapData, selectedYear]);

  useEffect(() => {
    showErrors();
    // Clear errors after showing them
    setErrors([]);
  }, [errors, showErrors]);

  useEffect(() => {
    fetchCountries();
    fetchYears();
    fetchAllMapData();
  }, [fetchCountries, fetchYears, fetchAllMapData]);

  useEffect(() => {
    if (selectedYear) {
      fetchDataBar(selectedYear);
    } else {
      setDataBar([]);
    }
  }, [selectedYear, fetchDataBar]);

  useEffect(() => {
    if (countries.length === 0) return;

    const countryCodes = selectedCountries.length > 0
      ? selectedCountries.map(country => country.shortName).join(',')
      : countries.map(country => country.shortName).join(',');

    fetchData(countryCodes);
  }, [selectedCountries, countries, fetchData]);

  const handleCountryChange = (event, newValue) => {
    setSelectedCountries(newValue);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Container maxWidth={isDesktop ? "lg" : (isTablet ? "md" : "sm")}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant={isMobile ? "h6" : (isTablet ? "h5" : "h4")}
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              my: 2,
            }}
          >
            Top Emitters GHG Emissions
          </Typography>
        </Grid>

        <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          align="left"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 500,
            marginBottom: theme.spacing(1),
            fontSize: '1rem',
          }}>Total GHG with Countries
          </Typography>
          <Autocomplete
            multiple
            id="country-select"
            options={countries}
            getOptionLabel={(option) => option.shortName}
            value={selectedCountries}
            onChange={handleCountryChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select Countries"
                placeholder="Choose countries (empty means all)"
                fullWidth
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.shortName}>
                {option.countryName}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.countryName}
                  {...getTagProps({ index })}
                  key={option.shortName}
                  style={{ margin: '2px' }}
                />
              ))
            }
          />
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : data.length > 0 ? (
            <Paper elevation={3} style={{ padding: theme.spacing(2) }}>
              {renderChart(LineChartGHGApex, data, true)}
            </Paper>
          ) : (
            <Typography align="center">No data available for the selected countries.</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          align="left"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 500,
            marginBottom: theme.spacing(1),
            fontSize: '1rem',
          }}>GHG Emissions Compare Data
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="year-select-label">Select Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              label="Select Year"
              onChange={handleYearChange}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {dataBar.length > 0 && (
          <Grid item xs={12} lg={6}>
            <Typography align="center" fontWeight="bold">Sector Emissions by {selectedYear}</Typography>
            {/* {renderChart(GroupBarSectorApex, dataBar)} */}
            <GroupBarSectorApex data={dataBar} />
          </Grid>
        )}

        {filteredMapData.length > 0 && selectedYear && (
          <Grid item xs={12} lg={6}>
            <Typography align="center" fontWeight="bold">World Map Total Emissions by {selectedYear}</Typography>
            <MapComponent data={filteredMapData} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default App;