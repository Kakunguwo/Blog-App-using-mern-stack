import React, { useState , useEffect} from 'react'
import PostItem from '../components/PostItem';
import axios from '../api/axios';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';


function CategoryPosts() {
  const {category} = useParams();
  const [posts, setPosts] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/posts/categories/${category}`);
      const allPosts = await response.data;
      setPosts(allPosts);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  }

  useEffect( ()=> {

    getPosts();
  },[category])

  if(isLoading){
    return <Loader/>;
  }

  return (
    
    <section className="posts">
      {posts.length > 0 ?
      <div className="container posts-container">
        {
          posts.map(({_id : id, thumbnail, category, title, description, creator, createdAt}) => {
            return (
              <PostItem 
                  key={id}
                  postId={id}
                  thumbnail={thumbnail}
                  category={category}
                  title={title}
                  description={description}
                  authorID={creator} 
                  createdAt={createdAt}
                />
            )
          })
        }
      </div> : <h2 className='center'>No posts found</h2>}
    </section>
  )
}

export default CategoryPosts