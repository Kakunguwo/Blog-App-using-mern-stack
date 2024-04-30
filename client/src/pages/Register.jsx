import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from "../api/axios";
const REGISTER_URL = "/users/register";


function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_pass: "",
  })

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function handleChange(event){
    const {name, value} = event.target;
    setUserData((prevValue)=>{
      return {
        ...prevValue,
        [name] : value,
      }
    }); 
  }

  const registerUser =async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post(REGISTER_URL, userData);
      const newUser = await response.data;
      console.log(newUser);
      if(!newUser){
        setError("Could not register. Please try again!");
      }
      setMessage("Successfully registered!!");
      setTimeout( () => { navigate('/login')}, {replace: true}, 20000);
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register-form" onSubmit={registerUser}>

          {error && <p className="form-error-msg">{error}</p>}
          {message && <p className="form-success-msg">{message}</p>}
          
          <input onChange={handleChange} type="text" placeholder='Full Name' name='name' value={userData.name} />
          <input onChange={handleChange} type="email" placeholder='Email Address' name='email' value={userData.email} />
          <input onChange={handleChange} type="password" placeholder='Password' name='password' value={userData.password} />
          <input onChange={handleChange} type="password" placeholder='Confirm Password' name='confirm_pass' value={userData.confirm_pass} />
          <button type="submit" className='btn primary'>Register</button>
        </form>
        <small>Already have an account? <Link to={"/login"}>Sign In</Link></small>
      </div>
    </section>
  )
}

export default Register