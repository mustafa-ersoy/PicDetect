import React from "react";
import {Navigate} from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function PrivateRoute({authenticated, children}){
  const navigate = useNavigate();

  if (!authenticated){
    localStorage.setItem('lastVisitedRoute', window.location.pathname);
  }
  return (
    authenticated ? children : <Navigate to='/login' />
  )
}

export default PrivateRoute;