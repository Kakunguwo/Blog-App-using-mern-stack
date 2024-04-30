import React, { useState, useEffect } from 'react';
import axios from "../api/axios";

import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const GET_AUTHOR_URL = "/users/";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAuthor =async () => {
    try {
      const response = await axios.get(GET_AUTHOR_URL);
      const authors = await response.data;
      setAuthors(authors);
      
    } catch (err) {
     console.log(err);
    }
    setIsLoading(false);
  }

  useEffect(()=> {
    getAuthor();
  }, [])

  if(isLoading){
    return <Loader/>
  }
  
  return (
    <section className="authors">
      {authors.length > 0 ? <div className="container authors-container">
        {
          authors.map(({_id: id, avatar, name, posts})=>{
            return <Link to={`/posts/users/${id}`} className='author'>
              <div className="author-avatar">
                <img src={`http://localhost:5001/uploads/${avatar}`} alt={name} />
              </div>
              <div className="authors-info">
                <h4>{name}</h4>
                <p>{posts}</p>
              </div>
            </Link>
          })
        }
      </div> : <h2 className="center">Could not get authors!</h2>}
    </section>
  )
}

export default Authors