import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login({onLogin}){
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');

    if (token) {
      if (lastVisitedRoute){
        navigate(lastVisitedRoute)
      }else{
      navigate('/dashboard')}
      onLogin();
    }
  }, []);

  const handleSubmit = async (event)=>{
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/user/login/', {email, password})
      const token = response.data.token;

      localStorage.setItem('token', token);
      let navigateRoute = '/dashboard';
      const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');
      if (lastVisitedRoute){navigateRoute = lastVisitedRoute}
      onLogin(response.data);
      navigate(navigateRoute);
    } catch(error){
      console.error(error);
    }
  }

  return (
    <div className="login-main">
      <div className="login-field">
        <div>
          <div className="login-logo-div">
            <img className="logo" src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" />
          </div>
        </div>
        <div className="login-text">
          <h2>Welcome Back!</h2>
          <h2>Please enter the credentials</h2>
        </div>
        <div className="form-field">
          <form className="login-form" onSubmit={handleSubmit}>
            <input className="login-input" type="email" required placeholder="email" value={email} onChange={(event)=>{setEmail(event.target.value)}} /><br/>
            <input className="login-input" type="password" required placeholder="password" value={password} onChange={(event)=>{setPassword(event.target.value)}} /><br/>
            <button className="login-button" type="submit">Login</button>
          </form>
        </div>
        <div>
          <p>OR</p>
          <p>if you don't have an account: <a href="/register">Signup</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login;