
import React, { useState, useEffect, useRef } from 'react';


function MainPage() {
  const [giphyData, setGiphyData] = useState([]);
  const [location, setLocation] = useState('New York');
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');
  const [weatherConditions, setWeatherConditions] = useState([]);
  const [locationDetails, setLocationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);  
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [selectedDetails, setSelectedDetails] = useState(null); // To store selected day's details
  
  const scrollContainerRef = useRef(null);

  const fetchGiphy = async (weatherType) => {
    const apiKey = 'gHv5UWjwarY4Ay9v2zovwarCedewfKP7';
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${weatherType}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data[0]?.images?.downsized_large?.url || '';  
  };

  const fetchWeatherData = async () => {
    const visualCrossingApiKey = '9TTJ32QWJE4RCWKUTP5XG3TUK'; // Replace with your API key
    const locationQuery = userLocation ? `${userLocation.latitude},${userLocation.longitude}` : location;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationQuery}/next7days?key=${visualCrossingApiKey}`;
    
    setIsLoading(true); // Start loading
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();
  
      if (data.error) {
        setError(data.error.message);
        return [];
      }
  
      const locationDetails = {
        address: data.address,
        timezone: data.timezone,
        alerts: data.alerts || [],
      };
      setLocationDetails(locationDetails);
  
      setWeatherConditions(data.days.map(day => ({
        condition: day.conditions,
        datetime: day.datetime,
        temperature: day.temp,
        description: day.description,
      })));
  
      return data.days.map(day => day.conditions);  // Return conditions only
    } catch (err) {
      console.error('Error fetching weather data:', err); // Log error
      setError('Failed to fetch weather data');
      return [];
    } finally {
      setIsLoading(false); // Ensure loading state is always reset
    }
  };
  

  useEffect(() => {
    if (location || userLocation) { // Only fetch when location or userLocation changes
      const fetchWeatherGifs = async () => {
        const weatherConditions = await fetchWeatherData();
        const weatherGifs = await Promise.all(weatherConditions.map(fetchGiphy));  
        setGiphyData(weatherGifs);
      };
      fetchWeatherGifs();
    }
  }, [location, userLocation]); 

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocation('');
          setShowLocationPopup(false);  // Close the popup after getting location
        },
        err => {
          setError('Unable to retrieve your location. Please try again later.');
          setShowLocationPopup(false);  // Close the popup on error
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setShowLocationPopup(false);  // Close the popup if geolocation is not supported
    }
  };

  const handleSearchChange = (e) => {
    setLocation(e.target.value);
  };

  const handleLocationPopupClose = () => {
    setShowLocationPopup(false);  // Close the popup without any action
  };

  const openModal = (details) => {
    setSelectedDetails(details);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
 <div className='section p-6 bg-blue-100'>
  <h1 className="text-2xl font-bold text-gray-800 mb-4">Search for Weather</h1>
  <label htmlFor="searchLoc" className="block text-gray-700 mb-2">
    Enter a location:
  </label>
  <input 
    type="text" 
    id="searchLoc" 
    value={location} 
    onChange={handleSearchChange} 
    placeholder="Enter a location" 
    className="w-full p-2 rounded-lg border border-gray-300"
  />
  <button
    onClick={() => setShowLocationPopup(true)}  // Show the location popup
    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
  >
    Use Current Location
  </button>
  {error && <p className="text-red-500 mt-2">{error}</p>}
</div>

      {/* Popup Modal for Location */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Allow Access to Your Location</h2>
            <p className="text-center mb-4">We need access to your location to show weather data for your area.</p>
            <div className="flex justify-between">
              <button
                onClick={getCurrentLocation}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Allow
              </button>
              <button
                onClick={handleLocationPopupClose}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="content bg-gray-100 h-screen flex items-center justify-center pt-6">
        <div className="w-full px-4">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <button
                  onClick={scrollLeft}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  ←
                </button>
                <button
                  onClick={scrollRight}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  →
                </button>
              </div>

              <div ref={scrollContainerRef} className="flex space-x-8 p-4 mx-auto overflow-x-auto">
  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
    <div key={day} className="flex-none w-full sm:w-60 p-4 bg-white rounded-lg shadow-lg">
      <div className="w-full mb-4">
        <img 
          src={giphyData[index]} 
          alt={`${day} Weather`} 
          className="w-full h-48 object-cover rounded-md"
        />
        <p className='desc'>
          {weatherConditions[index]?.description || 'No description available'}
        </p>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{day}</h3>
      {weatherConditions[index] && (
        <button
          onClick={() => openModal(weatherConditions[index])}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          More Details
        </button>
      )}
    </div>
  ))}
</div>

            </>
          )}
        </div>
      </div>

      {/* Modal to show more details */}
      {showModal && selectedDetails && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full sm:max-w-md">
      <h2 className="text-xl font-semibold mb-4">Weather Details</h2>
      <p><strong>Address:</strong> {locationDetails.address}</p>
      <p><strong>Timezone:</strong> {locationDetails.timezone}</p>
      <p><strong>Date:</strong> {selectedDetails.datetime}</p>
      <p><strong>Temperature:</strong> {selectedDetails.temperature}°C</p>
      <p><strong>Description:</strong> {selectedDetails.description}</p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={closeModal}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default MainPage;