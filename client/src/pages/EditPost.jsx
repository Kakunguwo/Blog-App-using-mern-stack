import React, { useState , useEffect, useContext} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';

function EditPost() {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorised");
  const [body, setBody] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect if user if not logged in to the login page

  useEffect(() => {
    if(!token){
      navigate("/login");
    }
  },[])




  const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Art", "Entertainment", "Investment", "Uncategorised", "Weather"];

   const modules = {
      toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
    };

    const formats = ["header","bold","italic","underline","strike","blockquote",
    "list","bullet","indent","link","image","color","clean",
    ];


    useEffect(()=> {
      const getPost = async () => {
        try {
          const response = await axios.get(`/posts/${id}`);
          setTitle(response.data.title);
          setBody(response.data.description);
          setCategory(response.data.category);
        } catch (error) {
          console.log(error);
        }
      }

      getPost();
    }, [])


    const editPost = async (e) => {
      e.preventDefault();

      const postDetail = new FormData();
      postDetail.set('title', title);
      postDetail.set('description', body);
      postDetail.set('category', category);
      postDetail.set('thumbnail', thumbnail);

      try {
        const response = await axios.patch(`/posts/${id}`, postDetail, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
        if(response.status === 200){
          return navigate('/')
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    }
 

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form-error-msg">{error}</p>}
        <form className="form create-post-form" onSubmit={editPost}>
          <input onChange={(e)=>{setTitle(e.target.value)}} type="text" placeholder='Title' value={title} autoFocus/>
          <select name="category" value={category} onChange={(e)=>{setCategory(e.target.value)}}>
            {
              POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
            }
            
          </select>
          <ReactQuill onChange={setBody} modules={modules} formats={formats} value={body}/>
          <input type="file" onChange={e => {setThumbnail(e.target.files[0])}} accept='png, jpg, jpeg' />
          <button type="submit" className='btn primary'>Update Post</button>
        </form>
      </div>
    </section>
  )
}

export default EditPost