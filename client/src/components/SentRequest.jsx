import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../static/socket-client';

function SentRequest() {
  const { requestId } = useParams();
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  useEffect(() => {
    // Listen for the 'requestAccepted' event from the receiver
    socket.on('requestAccepted1', (requestId) => {
      // Check if the received request ID matches the current request
      // Can use the requestId to identify the specific request
      // For example: if (requestId === currentRequestId)
      setIsRequestAccepted(true);
    });

    // Clean up the socket event listener when the component is unmounted
    return () => {
      socket.off('requestAccepted');
    };
  }, []);

  useEffect(() => {
    // Redirect to the swiping component when the request is accepted
    if (isRequestAccepted) {
      navigate(`/requests/swipe/${requestId}`);
    }
  }, [isRequestAccepted, navigate]);

  useEffect(() => {
    if (!state.session) {
      navigate('/');
    }
  }, []);

  return (
    <div className="sent-request-container">
      <h2>Pending Request</h2>
      <p>Waiting for the receiver to accept the request...</p>
    </div>
  );
}

export default SentRequest;
