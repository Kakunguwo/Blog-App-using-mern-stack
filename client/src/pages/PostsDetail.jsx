import React, {useContext, useEffect, useState} from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import DeletePost from "../pages/DeletePost";
import Loader from '../components/Loader';
import axios from '../api/axios';
import { UserContext } from '../context/userContext';



function PostsDetail() {

  const {id} = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [author_id, setAuthorid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const {currentUser} = useContext(UserContext);

  useEffect(()=>{
    const getPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setPost(response?.data);
        setAuthorid(response.data.creator);
      } catch (error) {
        setError(error);
      }
    }

    getPost();
  },[])

  if(isLoading){
    return <Loader/>
  }
  

  return (
    <section className="post-detail">
    {error && <p className='error'>{error}</p>}
      {post && <div className="container post-detail-container">
      <div className="post-detail-header">
        {<PostAuthor authorID={post.creator} createdAt={post.createdAt} />}
       {currentUser?.id == post.creator &&  <div className="post-detail-buttons">
       <Link to={`/posts/${post?._id}/edit`} className='btn sm primary'>Edit</Link>
       <DeletePost postID={post?._id}/>
     </div>}
      </div>
      <h1>{post.title}</h1>
      <div className="post-detail-thumbnail">
        <img src={`http://localhost:5001/uploads/${post.thumbnail}`} alt="" />
      </div>
      <p dangerouslySetInnerHTML={{__html: post.description}}></p>
       </div>}
    </section>
  )
}

export default PostsDetail