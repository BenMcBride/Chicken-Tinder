import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import socket from '../static/socket-client';

function ReceivedRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getReceivedRequests = async () => {
      try {
        const seshData = await JSON.parse(localStorage.getItem('session'));
        const id = seshData.user.id;
        const receivedRequestsResponse = await fetch(
          `http://localhost:8000/api/requests/received?recipient=${id}` // Pass the recipient ID as a query parameter
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
        const updatedRequests = requests.map((request) => {
          if (request._id === requestId) {
            return { ...request, status: 'Accepted' };
          }
          return request;
        });
        setRequests(updatedRequests);

        // Emit a socket event to notify the sender
        socket.emit('requestAccepted', requestId);
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
        // Request declined successfully, update the UI accordingly
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

  return (
    <div className="messages-container d-flex justify-content-center flex-column center">
      <h2 className="text-center">Received Requests</h2>
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
              <td>{request.searchDistance} mi</td>
              <td>
                <em>{request.status}</em>
              </td>
              <td>
                {request.status === 'Pending' ? (
                  <>
                    <Link to="/requests/swipe">
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
                ) : (
                  <span>None</span>
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