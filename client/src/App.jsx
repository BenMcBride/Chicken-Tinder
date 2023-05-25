import './bootstrap.min.css';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequestSync from './components/RequestSync';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import AuthProvider from './context/AuthContext';
import Dashboard from './components/Dashboard';
import ReceivedRequests from './components/ReceivedRequests';
import SentRequest from './components/SentRequest';
import SwipeComponent from './components/SwipeComponent';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Container className="d-flex mt-3" fluid style={{ margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/requests/pending/:requestId"
            element={<SentRequest />}
          />
          <Route path="/requests/new" element={<RequestSync />} />
          <Route
            path="/users/requests/received"
            element={<ReceivedRequests />}
          />
          <Route
            path="/requests/swipe/:requestId"
            element={<SwipeComponent />}
          />
        </Routes>
      </Container>
    </AuthProvider>
  );
}
export default App;
