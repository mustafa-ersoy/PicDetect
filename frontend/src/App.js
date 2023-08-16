import { Route, Navigate, Routes } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';

function App(){
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = ()=>{
    setAuthenticated(true);
  }
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('lastVisitedRoute');
    setAuthenticated(false);
  }

  return (
    <div className='app'>
      <div className='container'>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={authenticated ? <Navigate to='/dashboard' /> : <Login onLogin={handleLogin} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={
          <PrivateRoute authenticated={authenticated}>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path='/account' element={
          <PrivateRoute authenticated={authenticated}>
            <Account onLogout={handleLogout} />
          </PrivateRoute>
        } />
        <Route path='/upload' element={
          <PrivateRoute authenticated={authenticated}>
            <Upload />
          </PrivateRoute>
        } />
      </Routes>
      </div>
      <Footer />
    </div>
)}

export default App;