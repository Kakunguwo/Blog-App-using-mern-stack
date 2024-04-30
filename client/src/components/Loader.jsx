import React from 'react';
import LoadingGif from "../images/200w.gif";

function Loader() {
  return (
    <div className='loader'>
    
        <div className='loading-image'>
            <img src={LoadingGif} alt=''/>
        </div>
    
    </div>
  )
}

export default Loader