import React, { useState, useEffect, useContext } from 'react';

import { Link , useNavigate} from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from "../api/axios";
import Loader from "../components/Loader";
import DeletePost from './DeletePost';




function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const userID = currentUser?.id;

  

  // Redirect if user if not logged in to the login page

  useEffect(() => {
    if(!token){
      navigate("/login");
    }
  },[])

  useEffect(() => {
    const getUserPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/posts/users/${userID}`);
        setPosts(response?.data);
      } catch (error) {
        console.log(error)
      }

      setIsLoading(false);
    }

    getUserPosts();
  },[userID])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="dashboard">
      {
        posts.length ? <div className="container dashboard-container">
          {
            posts.map((post)=>{
              return (
                <article key={post._id} className='dashboard-post'>
                  <div className="dashboard-post-info">
                    <div className="dashboard-post-thumbnail">
                      <img src={`http://localhost:5001/uploads/${post.thumbnail}`} alt="" />
                    </div>
                    <h5>{post.title}</h5>
                  </div>
                  <div className="dashboard-post-actions">
                    <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                    <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                    <DeletePost postID={post._id}/>

                  </div>
                </article>
              )
            })
          }
        </div> : <h2 className="center">You have no posts</h2>
      }
    </section>
  )
}

export default Dashboard