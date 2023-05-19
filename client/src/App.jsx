// import Main from './views/Main';
import './bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Detail from './views/Detail';
import { useState } from "react";
import NewUserForm from './components/NewUserForm';
import RequestSync from './components/RequestSync';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import AuthProvider from './context/AuthContext';

function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <AuthProvider>
      <Header/>
      <Container className='d-flex mt-3' style={{margin: '0 auto'}}>
        <Routes>
          <Route path="/" element={<Navigate to="/users/new" />} />
          <Route path="/users/new" element={<NewUserForm setLoaded={setLoaded} />} />
          <Route path="/request/new" element={<RequestSync setLoaded={setLoaded} />} />
          {/* <Route path="/products/:id/edit" element={<ProductUpdate />} /> */}
        </Routes>
      </Container>
    </AuthProvider>
  );
}
export default App;
