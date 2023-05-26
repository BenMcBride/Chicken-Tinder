import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import socket from '../static/socket-client';

function SentRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getSentRequests = async () => {
      try {
        const seshData = await JSON.parse(localStorage.getItem('session'));
        const id = seshData.user.id;
        const sentRequestsResponse = await fetch(
          `http://localhost:8000/api/requests/sent?sender=${id}`
        );
        const sentRequestsData = await sentRequestsResponse.json();
        const sentRequests = sentRequestsData.requests;
        setRequests(sentRequests);
      } catch (error) {
        console.error(error);
      }
    };
    getSentRequests();
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('session');
      if (!sessionData) {
        navigate('/');
      }
    };
    checkSession();
  }, []);

  const handleRejoinSocket = (requestId) => {
    socket.emit('rejoinSocket', requestId);
    navigate(`/requests/swipe/${requestId}`);
  };

  const handleRejoinWait = (requestId) => {
    navigate(`/requests/pending/${requestId}`);
  };

  return (
    <div className="messages-container d-flex justify-content-center flex-column center">
      <h2 className="text-center">Sent Requests</h2>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Search Address</th>
            <th>Search Distance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={index}>
              <td>{request.searchLocation}</td>
              <td>{request.searchDistance} km</td>
              <td>
                <em>{request.status}</em>
              </td>
              <td>
                {request.status === 'Pending' ? (
                  <>
                    <Button
                      variant="primary"
                      className="ml-1"
                      onClick={() => handleRejoinWait(request._id)}
                    >
                      Re-join Waiting room
                    </Button>
                  </>
                ) : request.status === 'Accepted' ? (
                  <>
                    <Button
                      variant="primary"
                      className="ml-1"
                      onClick={() => handleRejoinSocket(request._id)}
                    >
                      Rejoin Swipe
                    </Button>
                  </>
                ) : request.status === 'Completed' ? (
                  <>
                    <Link to={request.matchedRestaurantLink} target="_blank">
                      Matched Restaurant
                    </Link>
                  </>
                ) : (
                  <></>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default SentRequests;
