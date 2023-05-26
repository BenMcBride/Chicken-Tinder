import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../static/socket-client';

function SentRequest() {
  const { requestId } = useParams();
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [isRequestDenied, setIsRequestDenied] = useState(false);
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  useEffect(() => {
    // Listen for the 'requestAccepted' event from the receiver
    socket.on('requestAccepted1', (receivedRequestId) => {
      if (requestId === receivedRequestId) {
        setIsRequestAccepted(true);
      }
    });
    socket.on('requestDenied1', (receivedRequestId) => {
      if (requestId === receivedRequestId) {
        setIsRequestDenied(true);
      }
    });

    // Clean up the socket event listener when the component is unmounted
    return () => {
      socket.off('requestAccepted1');
      socket.off('requestDenied1');
    };
  }, []);

  useEffect(() => {
    if (isRequestAccepted) {
      navigate(`/requests/swipe/${requestId}`);
    }
  }, [isRequestAccepted, navigate]);

  useEffect(() => {
    if (isRequestDenied) {
      navigate(`/users/requests/received`);
    }
  }, [isRequestDenied, navigate]);

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