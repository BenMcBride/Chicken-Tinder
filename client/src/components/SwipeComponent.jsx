import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import socket from '../static/socket-client';

const containerStyle = {
  display: 'none',
  width: '100%',
  height: '400px',
};

const center = {
  lat: 0,
  lng: 0,
};

const options = {
  disableDefaultUI: true,
};

function SwipeComponent() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const searchAddress = '566 University Rd, Friday Harbor, WA 98250';
  const searchDistance = '2000';
  const apiKey = 'AIzaSyDov8i3afDlFQoqJKJO0CvGQuGDwSKlAHM'; // Replace with your actual API key
  const geoApiKey = 'e6d34d302758481bad0d32c23984a630';

  const geocodeAddress = async (address) => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${geoApiKey}`
      );
      const { data } = response;
      if (data.features.length > 0) {
        const location = data.features[0].geometry.coordinates;
        return { lat: location[1], lng: location[0] };
      } else {
        throw new Error('Failed to geocode address');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const fetchRestaurants = async (location, radius) => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/requests/google',
        {
          params: {
            location: `${location.lat},${location.lng}`,
            radius: radius,
            type: 'restaurant',
            key: apiKey,
          },
        }
      );

      const { data } = response;
      if (data.status === 'OK') {
        const restaurants = data.results;
        return restaurants;
      } else {
        throw new Error('Failed to fetch restaurants');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const location = await geocodeAddress(searchAddress);
        const restaurants = await fetchRestaurants(location, searchDistance);
        setRestaurants(restaurants);
      } catch (error) {
        console.error(error);
      }
    };

    getRestaurants();
  }, []);

  const handleAccept = () => {
    const acceptedRestaurant = restaurants[currentIndex];
    socket.emit('restaurantAccepted', acceptedRestaurant);
    setCurrentIndex(currentIndex + 1);
  };

  const handleReject = () => {
    const rejectedRestaurant = restaurants[currentIndex];
    socket.emit('restaurantRejected', rejectedRestaurant);
    setCurrentIndex(currentIndex + 1);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  return isLoaded ? (
    <div className="swipe-container center">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={options}
      />
      {restaurants.length > 0 && currentIndex < restaurants.length ? (
        <Card className="center">
          <Card.Header>
            <Card.Title>{restaurants[currentIndex].name}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Text>Rating: {restaurants[currentIndex].rating}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Reject
            </Button>
          </Card.Footer>
        </Card>
      ) : (
        // <Card
        //   restaurant={restaurants[currentIndex]}
        //   onAccept={handleAccept}
        //   onReject={handleReject}
        // />
        <p>No more restaurants to swipe!</p>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default SwipeComponent;
