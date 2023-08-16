import axios from "axios";
import { useState } from "react";

function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event)=>{
    event.preventDefault();

    try{
      setShowSuccess(false);
      setRegSuccess(false);
      const response = await axios.post('http://localhost:8000/api/user/register/', {email, name, password});
      if (response.data.user){
        setRegSuccess(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch(error){
      console.error(error);
    }finally{
      setShowSuccess(true)
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
          <h2>JOIN US!</h2>
        </div>
        {showSuccess && <div>{regSuccess ? (<p style={{color:'green'}}>Registration Successful ✅</p>):(<p style={{color:'red'}}>Please Use a Different Email ❌</p>)}</div>}
        <div className="form-field">
          <form className="login-form" onSubmit={handleSubmit}>
            <input className="login-input" type="text" required placeholder="name surname" value={name} onChange={(event)=>{setName(event.target.value)}} /><br/>
            <input className="login-input" type="email" required placeholder="email" value={email} onChange={(event)=>{setEmail(event.target.value)}} /><br/>
            <input className="login-input" type="password" required placeholder="password" value={password} onChange={(event)=>{setPassword(event.target.value)}} /><br/>
            <button className="login-button" type="submit">Register</button>
          </form>
        </div>
        <div>
          <p>OR</p>
          <p>if you have an account: <a href="/login">Log in</a></p>
        </div>
      </div>
    </div>
  )

}

export default Register;