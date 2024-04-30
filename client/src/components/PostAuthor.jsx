import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import axios from '../api/axios';

import ReactTimeAgo from "react-time-ago";

import TimeAgo from "javascript-time-ago";


import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";






TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);


function PostAuthor({authorID, createdAt}) {
  const [author, setAuthor] = useState({});

  const date = new Date(createdAt);
 

  const getAuthor = async () => {
    try {
      const response = await axios.get(`/users/${authorID}`);
      setAuthor(response?.data);
    } catch (err) {
      console.log(err);
    }
   
  }

  useEffect( ()=> {
    getAuthor();

    
  })
  return (
    <Link to={`/posts/users/${authorID}`} className="post-author">
        <div className="post-author-avatar">
            <img src={`http://localhost:5001/uploads/${author.avatar}`} alt="Author" />
        </div>
        <div className="post-author-details">
            <h5>By: {author.name}</h5>
            <small><ReactTimeAgo date={date} locale='en-US'/></small>
        </div>
    </Link>
  )
}

export default PostAuthor