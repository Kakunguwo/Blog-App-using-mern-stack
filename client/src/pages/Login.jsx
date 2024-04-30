import React, { useState , useContext} from 'react'
import { Link , useNavigate} from 'react-router-dom';
import axios from "../api/axios";
import {UserContext} from "../context/userContext";

const LOGIN_URL = "/users/login";

function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {setCurrentUser} = useContext(UserContext);

  function handleChange(event){
    const {name, value} = event.target;
    setUserData((prevValue)=>{
      return {
        ...prevValue,
        [name] : value,
      }
    }); 
  }

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(LOGIN_URL, userData);
      const user = await response.data;
      setCurrentUser(user);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login-form" onSubmit={loginUser}>

          {error && <p className="form-error-msg">{error}</p>}
          
          <input onChange={handleChange} type="email" placeholder='Email Address' name='email' value={userData.email} autoFocus/>
          <input onChange={handleChange} type="password" placeholder='Password' name='password' value={userData.password} />
          <button type="submit" className='btn primary'>Login</button>
        </form>
        <small>Don't have an account? <Link to={"/register"}>Sign Up</Link></small>
      </div>
    </section>
  )
}

export default Login;