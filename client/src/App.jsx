import './bootstrap.min.css';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequestSync from './components/RequestSync';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import AuthProvider from './context/AuthContext';
import Dashboard from './components/Dashboard';
import ReceivedRequests from './components/ReceivedRequests';
import PendingSentRequest from './components/PendingSentRequest';
import SwipeComponent from './components/SwipeComponent';
import SentRequests from './components/SentRequests';

function App() {
  return (
    <AuthProvider>
      <Container className="d-flex splash" fluid style={{ margin: '0 auto' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/requests/pending/:requestId"
            element={<PendingSentRequest />}
          />
          <Route path="/requests/new" element={<RequestSync />} />
          <Route
            path="/users/requests/received"
            element={<ReceivedRequests />}
          />
          <Route path="/users/requests/sent" element={<SentRequests />} />
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
