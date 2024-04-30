import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

import axios from '../api/axios';


function DeletePost({postID}) {

  const navigate = useNavigate();
  const location = useLocation();
  

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const userID = currentUser?.id;



  // Redirect if user if not logged in to the login page

  useEffect(() => {
    if(!token){
      navigate("/login");
    }
  },[])

  const deletePost = async (postID) => {
    try {
      // Display confirmation modal
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });
  
      // If the user confirms deletion
      if (confirmed.isConfirmed) {
        // Send delete request to server
        const response = await axios.delete(`/posts/${postID}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        // If deletion is successful (status code 200)
        if (response.status === 200) {
          // Navigate to appropriate page
          if (location.pathname == `/myposts/${userID}`) {
            navigate(0);
          } else {
            navigate('/');
          }
  
          // Show success message
          Swal.fire(
            'Deleted!',
            'Your post has been deleted.',
            'success'
          );
        } else {
          // Show error message if deletion fails
          Swal.fire(
            'Error!',
            'Failed to delete the post.',
            'error'
          );
        }
      } else {
        // Show message if user cancels deletion
        Swal.fire(
          'Cancelled',
          'Your post is safe :)',
          'info'
        );
      }
    } catch (error) {
      // Log any errors
      console.log(error);
    }
  }
  
  

  return (
   <Link to={`/posts/${postID}/delete`} onClick={() => deletePost(postID)} className='btn sm danger'>Delete</Link>
       
  )
}

export default DeletePost