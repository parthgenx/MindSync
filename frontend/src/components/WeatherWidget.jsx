import { useState } from 'react'
import { Cloud, Search, Droplets, Wind } from 'lucide-react'
import { weatherAPI } from '../services/api'
function WeatherWidget() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fetchWeather = async (e) => {
    e.preventDefault()
    if (!city.trim()) return
    setLoading(true)
    setError('')
    
    try {
      const data = await weatherAPI.getWeather(city)
      setWeather(data)
    } catch (err) {
      setError('City not found. Please try again.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Cloud className="text-indigo-400" />
          Weather Forecast
        </h2>
        {/* Search */}
        <form onSubmit={fetchWeather} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </form>
        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-6">
            {error}
          </div>
        )}
        {/* Weather Display */}
        {weather && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Info */}
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2">{weather.city}</h3>
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-20 h-20"
                />
                <div>
                  <p className="text-5xl font-bold">{Math.round(weather.temperature)}°C</p>
                  <p className="text-gray-400 capitalize">{weather.description}</p>
                </div>
              </div>
            </div>
            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-hover p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Cloud size={18} />
                  <span className="text-sm">Feels Like</span>
                </div>
                <p className="text-2xl font-semibold">{Math.round(weather.feels_like)}°C</p>
              </div>
              <div className="glass-hover p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Droplets size={18} />
                  <span className="text-sm">Humidity</span>
                </div>
                <p className="text-2xl font-semibold">{weather.humidity}%</p>
              </div>
              <div className="glass-hover p-4 rounded-lg col-span-2">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Wind size={18} />
                  <span className="text-sm">Wind Speed</span>
                </div>
                <p className="text-2xl font-semibold">{weather.wind_speed} m/s</p>
              </div>
            </div>
          </div>
        )}
        {/* Initial State */}
        {!weather && !error && (
          <div className="text-center py-12 text-gray-400">
            <Cloud size={48} className="mx-auto mb-4 opacity-50" />
            <p>Enter a city name to get weather information</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default WeatherWidget