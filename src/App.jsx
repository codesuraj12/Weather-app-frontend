import { useEffect, useState } from 'react'

import './App.css'
import Button from '@mui/material/Button';
import Cloudy from '/cloudy.png';
import Rain from '/rain.png';
import Snow from '/snow.png';
import Sun from '/sun.png';
import Thunder from '/thunderstorm.png';
import NightBackground from '/night-background.jpg'
import DayBackground from '/day-time.jpg'
import {

  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { Search, LocationOn, Thermostat, WbTwilight, Sunny } from '@mui/icons-material';


function App() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
  const fetchWeather = async (cityname) => {

    setLoading(true)
    try {

      const response = await fetch(`${API_BASE_URL}/weather/${cityname}`)
      if (!response.ok) {
        throw new Error('error is found')
      }
      const weatherData = await response.json()
      setData(weatherData)

    } catch (error) {
      console.error('Error:', error)

    }
    finally {
      setLoading(false) // ✅ Button becomes clickable again, spinner stops
    }

  }
  // ye time ke liye
  const currentTime = () => {
    const date = data.dt
    const timezone = data.timezone
    const citytime = new Date((date + timezone) * 1000)
    const hours = citytime.getUTCHours()
    const minute = (citytime.getUTCMinutes()).toString().padStart(2, '0')
    return `${hours} : ${minute}`
  }

  const weatherImg = (main) => {
    switch (main) {
      case 'Clear':
        return Sun
      case 'Clouds':
        return Cloudy
      case 'Rain':
        return Rain
      case "Thunderstorm":
        return Thunder
      case 'Snow':
        return Snow

      default:
        return Cloudy

    }
  }

  // ye start me hi chalega
  useEffect(() => {
    fetchWeather(city || 'Khanapur')
  }, [])

  useEffect(() => {
    const res = fetch(`${import.meta.env.VITE_BACKEND_URL}/weather/${city}`)
      .then((res) => res.json())
      .then(data => console.log(data))

  }, [])



  return (
    <>
      <div style={{
        minHeight: '100vh', padding: '4px', backgroundColor: '#31255a'
      }}>

        <Container maxWidth="md">

          <div>
            <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h3" component="h1" gutterBottom>
                🌤️ Weather App
              </Typography>
              <Typography variant="subtitle1">
                Get real-time weather information
              </Typography>
            </Paper>

            <Card elevation={2} sx={{ mb: 3, backgroundColor: '#8fe0ff' }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                  {/* 
              // this is searching button */}
                  <Button
                    variant="contained"
                    color="primary"
                    // yha arrow function me fetchweather chalaya he taki click krne pr hi vo chle naki pehle
                    onClick={() => fetchWeather(city)}
                    disabled={loading || !city.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? 'Loading...' : 'Search'}
                  </Button>

                </Box>
              </CardContent>
            </Card>




            <div>

              {data.main && (


                <Card elevation={3} sx={{ backgroundColor: '#ff9b83' }}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <LocationOn variant="contained" color='primary' />
                        {data.name}, {data.sys?.country}
                      </Typography>
                    </Box>
                    {data.sys && (


                      <Box sx={{ textAlign: 'center', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 1 }}>
                        <Box sx={{ background: 'linear-gradient(135deg, #226ba3, #1a4d7a)', padding: '12px', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                          <Sunny sx={{ fontSize: 40, mb: 1, color: '#ff4d00' }} />

                          <Typography variant="body2">

                            Sunrise
                          </Typography>
                          <Typography variant="body2">
                            {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2">
                            {new Date(data.sys.sunrise * 1000).toDateString()}
                          </Typography>

                          {currentTime()}
                        </Box>

                        <Box sx={{ background: 'linear-gradient(135deg, #226ba3, #1a4d7a)', padding: '12px', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                          <WbTwilight sx={{ fontSize: 40, mb: 1, color: '#ee5d6c' }} />

                          <Typography variant="body2">
                            Sunset
                          </Typography>
                          <Typography variant="body2">
                            {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
                          </Typography>
                        </Box>

                      </Box>

                    )}

                    <Divider sx={{ mb: 3 }} />

                    {/* paper is create one background surface with shadow
                      box is for the box 
                          sx ek shortcut styling prop hai jo tumhe direct component ke andar hi CSS likhne deta hai
                       */}

                    <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>

                      {/* Temperature */}
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center', minWidth: 150, bgcolor: 'info.light', color: 'white' }}>
                        <Thermostat sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h4" component="div">
                          {Math.round(data.main.temp - 273.15)}°C
                        </Typography>
                        <Typography variant="body2">
                          Temperature
                        </Typography>

                      </Paper>
                      {/* Weather Description */}
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center', minWidth: 150, bgcolor: 'info.main', color: 'white' }}>
                        <img

                          src={weatherImg(data.weather[0].main)}
                          alt={data.weather[0].description}
                          style={{
                            width: 60,
                            height: 60,
                            marginBottom: '8px',


                            padding: '4px'
                          }}
                        />

                        <Typography variant="h6" component="div" sx={{ textTransform: 'capitalize' }}>
                          {data.weather[0].description}
                        </Typography>
                        <Typography variant="body2">
                          Condition
                        </Typography>
                      </Paper>

                      {/* body2 → font size ~14px, line height 1.43 */}
                    </Box>
                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{color:'#253949'}}>
                          {data.main.humidity}%
                        </Typography>
                        <Typography variant="body2"  sx={{color:'white'}}>
                          Humidity
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{color:'#253949'}}>
                          {Math.round((data.wind?.speed) * 3.6)} km/h

                        </Typography>
                        <Typography variant="body2" sx={{color:'white'}}>
                          Wind Speed
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{color:'#253949'}}>
                          {Math.round((data.wind?.gust) * 3.6)} km/h
                        </Typography>
                        <Typography variant="body2" sx={{color:'white'}}>
                          Gust
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{color:'#253949'}}>
                          {data.visibility / 1000} km
                        </Typography>
                        <Typography variant="body2" sx={{color:'white'}}>
                          Visibility
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{color:'#253949'}}>
                          {data.weather[0].main}
                        </Typography>
                        <Typography variant="body2" sx={{color:'white'}}>
                          Weather
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}


            </div>
            {data.cod === '404' && (
              <Card elevation={2} sx={{ backgroundColor: '#ff9b83' }}>
                <CardContent>
                  <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
                    City not found. Please try again.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </div>

        </Container>
      </div>
    </>
  )
}

export default App
