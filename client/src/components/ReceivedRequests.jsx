import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import socket from '../static/socket-client';

function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getReceivedRequests = async () => {
      try {
        const seshData = await JSON.parse(localStorage.getItem('session'));
        const id = seshData.user.id;
        const receivedRequestsResponse = await fetch(
          `http://localhost:8000/api/requests/received?recipient=${id}`
        );
        const receivedRequestsData = await receivedRequestsResponse.json();
        const receivedRequests = receivedRequestsData.requests;
        setRequests(receivedRequests);
      } catch (error) {
        console.error(error);
      }
    };
    getReceivedRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/requests/${requestId}/accept`,
        {
          method: 'PATCH',
        }
      );
      if (response.ok) {
        socket.emit('requestAccepted', requestId);
        const updatedRequests = requests.map((request) => {
          if (request._id === requestId) {
            return { ...request, status: 'Accepted' };
          }
          return request;
        });
        setRequests(updatedRequests);
      } else {
        console.error('Failed to accept request');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/requests/${requestId}/decline`,
        {
          method: 'PATCH',
        }
      );
      if (response.ok) {
        socket.emit('requestDenied', requestId);
        const updatedRequests = requests.map((request) => {
          if (request._id === requestId) {
            return { ...request, status: 'Declined' };
          }
          return request;
        });
        setRequests(updatedRequests);
      } else {
        console.error('Failed to decline request');
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="messages-container d-flex justify-content-center flex-column center">
      <h2 className="text-center">Received Requests</h2>
      <Table striped bordered responsive className="tablebg">
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
              <td>{request.searchDistance * 0.001} km</td>
              <td>
                <em>{request.status}</em>
              </td>
              <td>
                {request.status === 'Pending' ? (
                  <>
                    <Link to={`/requests/swipe/${request._id}`}>
                      <Button
                        variant="success"
                        onClick={() => handleAccept(request._id)}
                      >
                        Accept
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="ml-1"
                      onClick={() => handleDecline(request._id)}
                    >
                      Decline
                    </Button>
                  </>
                ) : request.status === 'Accepted' ? (
                  <>
                    <Button
                      variant="primary"
                      className="ml-1 btn-bg-accent"
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

export default ReceivedRequests;
