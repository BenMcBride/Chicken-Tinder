import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import socket from '../static/socket-client';
import Modal from 'react-bootstrap/Modal';

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
  const [showModal, setShowModal] = useState(false);
  const [matchedRestaurant, setMatchedRestaurant] = useState(null);
  const { requestId } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoUrl, setPhotoUrl] = useState('');
  const [link, setLink] = useState('');
  const [searchAddress, setSearchAddress] = useState(''); // State for storing search address
  const [searchDistance, setSearchDistance] = useState(''); // State for storing search distance
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
        const restaurants = data.results.map((restaurant) => {
          let photoUrl = '';
          if (restaurant.photos && restaurant.photos.length > 0) {
            const photoReference = restaurant.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxheight=400&photo_reference=${photoReference}&key=${apiKey}`;
          }
          return {
            ...restaurant,
            photoUrl: photoUrl,
          };
        });
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
    const getRequestData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/requests/${requestId}`
        );
        const { data } = response;
        setSearchAddress(data.message.searchLocation);
        setSearchDistance(data.message.searchDistance);
      } catch (error) {
        console.error(error);
      }
    };

    getRequestData();
  }, []);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const location = await geocodeAddress(searchAddress);
        const restaurants = await fetchRestaurants(location, searchDistance);
        setRestaurants(restaurants);
        setPhotoUrl(restaurants.length > 0 ? restaurants[0].photoUrl : '');
      } catch (error) {
        console.error(error);
      }
    };

    if (searchAddress && searchDistance) {
      getRestaurants();
    }
  }, [searchAddress, searchDistance]);

  useEffect(() => {
    if (currentIndex < restaurants.length) {
      setPhotoUrl(restaurants[currentIndex].photoUrl);
    }
  }, [currentIndex, restaurants]);

  useEffect(() => {
    socket.on('matchedRestaurant', (matchedRestaurant) => {
      const placeId = matchedRestaurant.place_id;
      setLink(`https://www.google.com/maps/place/?q=place_id:${placeId}`);
      setMatchedRestaurant(matchedRestaurant);
      setShowModal(true);
    });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setMatchedRestaurant(null);
  };

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
            <Card.Title className="text-center">
              {restaurants[currentIndex].name}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Img variant="top" src={photoUrl} />
            <Card.Text className="mt-2 text-center">
              Rating: {restaurants[currentIndex].rating}
            </Card.Text>
          </Card.Body>
          <Card.Footer className="w-100 text-center">
            <Button variant="primary" onClick={handleAccept}>
              Accept
            </Button>
            <Button className="ml-1" variant="danger" onClick={handleReject}>
              Reject
            </Button>
          </Card.Footer>
        </Card>
      ) : (
        <p>No more restaurants to swipe!</p>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Matched Restaurant</Modal.Title>
        </Modal.Header>
        {matchedRestaurant && (
          <>
            <Modal.Body>
              <Card>
                <Card.Header>
                  <Card.Title className="text-center">
                    {matchedRestaurant.name}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Img variant="top" src={matchedRestaurant.photoUrl} />
                  <Card.Text className="mt-2 text-center">
                    Rating: {matchedRestaurant.rating}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="w-100 text-center">
                  <Button variant="primary" href={link} target="_blank">
                    View Restaurant
                  </Button>
                </Card.Footer>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default SwipeComponent;
