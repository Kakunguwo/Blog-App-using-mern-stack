import React, { useState , useContext} from 'react';
import {Link} from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import {UserContext} from "../context/userContext";


function Header() {
  const [isNavShowing , setIsNavShowing] = useState(window.innerWidth > 800 ? true : false);
  const {currentUser} = useContext(UserContext);
  const userID = currentUser?.id;
  const userName = currentUser?.name;

  function closeNavHandler(){
    if(window.innerWidth < 800){
      setIsNavShowing(false);
    } else{
      setIsNavShowing(true);
    }
  }
  return (
    <nav>
        <div className="container nav_container">
            <h2 className='nav_logo'>
                <Link to={"/"} onClick={closeNavHandler}>BlogApp</Link>
            </h2>
            {currentUser && isNavShowing && <ul className='nav-menu'>
                <li><Link to={`/profile/${userID}`} onClick={closeNavHandler}>{userName}</Link></li>
                <li><Link to={"/create"} onClick={closeNavHandler}>Create Post</Link></li>
                <li><Link to={"/authors"} onClick={closeNavHandler}>Authors</Link></li>
                <li><Link to={"/logout"} onClick={closeNavHandler}>Logout</Link></li>
            </ul>}
            {!currentUser && isNavShowing && <ul className='nav-menu'>
                <li><Link to={"/authors"} onClick={closeNavHandler}>Authors</Link></li>
                <li><Link to={"/login"} onClick={closeNavHandler}>Login</Link></li>
            </ul>}
            <button className="nav_toggle-btn" onClick={()=> setIsNavShowing(!isNavShowing)}>
              {isNavShowing ? <MdCancelPresentation /> : <FaBars />}
            </button>
            
            
        </div>
    </nav>
  )
}

export default Header