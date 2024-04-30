import React, { useState , useContext, useEffect} from 'react'
import { Link , useNavigate} from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { UserContext } from '../context/userContext';
import Loader from "../components/Loader";
import axios from '../api/axios';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";


function UserProfile() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const userID = currentUser?.id;

  // Redirect if user if not logged in to the login page

  useEffect(() => {
    if(!token){
      navigate("/login");
    }
  },[token, navigate])

  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setCurrentShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [isEditAvatarShowing, setIsEditAvatarShowing] = useState(false);
  
  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  }

  const changeAvatar = async () => {
    setIsEditAvatarShowing(false);
    try {
      const avatarData = new FormData();
      avatarData.set('avatar', avatar);
      const response = await axios.post('/users/change-avatar', avatarData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
      setAvatar(response?.data.avatar);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    const userDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/users/${userID}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setName(response.data.name);
        setEmail(response.data.email);
        setAvatar(response.data.avatar);
      } catch (error) {
        setError(error.response.data.message);
      }

      setIsLoading(false);
    }

    userDetails();
  },[userID, token])

  const editUser = async (e) => {
    e.preventDefault();

    const userDetail = new FormData();
    userDetail.set('name', name);
    userDetail.set('email', email);
    userDetail.set('currentPassword', currentPassword);
    userDetail.set('newPassword', newPassword);
    userDetail.set('newConfirmPassword', confirmPassword);

    try {
      const response = await axios.patch(`/users/edit-user`, userDetail, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
      if(response.status === 200){
        //User should be logged out after a successfull update
        return navigate('/logout')
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="profile">
      <div className="container profile-container">
        <Link to={`/myposts/${userID}`} className='btn'>
          My Posts
        </Link>
        <div className="profile-details">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              <img src={`http://localhost:5001/uploads/${avatar}`} alt='' />
            </div>
            {/* Form to update avatar */}
            <form  className="avatar-form">
              <input 
                onChange={(e)=>{setAvatar(e.target.files[0])}} 
                type="file" 
                name='avatar' 
                id='avatar' 
                accept='png, jpg, jpeg' 
              />
              <label htmlFor="avatar" onClick={() => setIsEditAvatarShowing(true)}><FaEdit /> </label>
            </form>
            {isEditAvatarShowing && <button className="profile-avatar-btn" onClick={changeAvatar}><FaCheck/></button>}
          </div>
          <h1>{name}</h1>

          {/* Form to update user input */}
          <form className="form profile-form" onSubmit={editUser}>
            {error && <p className="form-error-msg">{error}</p>}
            <input type="text" name='name' placeholder='Full name' onChange={handleChange} value={name}/>
            <input type="email" name='email' placeholder='Email address' onChange={handleChange} value={email}/>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type={showCurrentPassword ? 'text' : 'password'} name='currentPassword' placeholder='Current password' onChange={handleChange} value={currentPassword}/>
              <button 
                type="button" 
                onClick={()=> setCurrentShowPassword(!showCurrentPassword)}
                style={{ marginLeft: '-30px' }}>
                {showCurrentPassword ? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
               <input type={showNewPassword ? 'text' : 'password'} name='newPassword' placeholder='New password' onChange={handleChange} value={newPassword}/>
              <button 
                type="button" 
                onClick={()=> setNewShowPassword(!showNewPassword)}
                style={{ marginLeft: '-30px' }}>
                {showNewPassword ? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
               <input type={showConfirmPassword ? 'text' : 'password'} name='confirmPassword' placeholder='Confirm password' onChange={handleChange} value={confirmPassword}/>
              <button 
                type="button" 
                onClick={()=> setConfirmShowPassword(!showConfirmPassword)}
                style={{ marginLeft: '-30px' }}>
                {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>

            
           
            <button type="submit" className='btn primary'>Update Profile</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfile