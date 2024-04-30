import React from 'react';
import {Link} from "react-router-dom";
import PostAuthor from './PostAuthor';


function PostItem({postId, thumbnail, category, title, description, authorID, createdAt}) {
    const shortDescription = description.length > 145 ? description.substr(0, 145) + '...' : description;
    const postTitle = title.length > 30 ? title.substr(0, 30) + '...' : title;
  return (
    
    <article className="post">
        <div className="post-thumbnail">
            <img src={`http://localhost:5001/uploads/${thumbnail}`} alt={title} srcset="" />
        </div>
        <div className="post-content">
            <Link to={`/posts/${postId}`}>
                <h3>{postTitle}</h3>
            </Link>
            <p dangerouslySetInnerHTML={{__html: shortDescription}}></p>
            <div className="post-footer">
                <PostAuthor authorID = {authorID} createdAt={createdAt}/>
                <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
            </div>
        </div>
    </article>
  )
}

export default PostItem;