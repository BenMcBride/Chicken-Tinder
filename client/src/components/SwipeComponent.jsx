import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';

function SwipeComponent() {
  const [restaurants, setRestaurants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch restaurants or get data from the server
    // const fetchRestaurants = async () => {
    //   try {
    //     // Make an API call to fetch the restaurants
    //     const response = await fetch('http://localhost:8000/api/restaurants');
    //     const data = await response.json();
    //     setRestaurants(data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // fetchRestaurants();
  }, []);

  const handleAccept = () => {
    // Handle accepting the current restaurant
    // You can update the status, perform further actions, etc.
    // Example: setAcceptedRestaurants([...acceptedRestaurants, restaurants[currentIndex]]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleReject = () => {
    // Handle rejecting the current restaurant
    // You can update the status, perform further actions, etc.
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="swipe-container">
      {restaurants.length > 0 && currentIndex < restaurants.length ? (
        <Card
          restaurant={restaurants[currentIndex]}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ) : (
        <p>No more restaurants to swipe!</p>
      )}
    </div>
  );
}

export default SwipeComponent;
