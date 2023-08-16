import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleImage from "./SingleImage";
import Navbar from "./Navbar";
import {getImages} from '../store'

function ImageList(){
  const [searchTerm, setSearchTerm] = useState('')
  const {data, loading, error} = useSelector((state)=>state.images);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getImages(''))
  }, [])

  const handleSubmit = (event)=>{
    event.preventDefault();
    dispatch(getImages(searchTerm))
  }

  let content = <div></div>

  if (loading){content = <div>Loading</div>}
  else if (error){content = <div>{error}</div>}
  else if (data.length) {
    content = data.map((image, index)=>{
      return (
        <div key={image.id}>
          <SingleImage image={image} index={index} />
        </div>
      )
    });
  }

  return (
    <div>
      <div>
        <Navbar />
        <div className="search-bar">
          <form className="search-form" onSubmit={handleSubmit}>
            <input className="search-input" placeholder="dog, car, person etc." value={searchTerm} onChange={(event)=>{setSearchTerm(event.target.value)}} />
            <button className="search-button" type="submit">Search Objects</button>
          </form>
        </div>
      </div>
      <div className="image-list-main">
        <div className="image-list">
          {content}
        </div>
      </div>
    </div>)
}

export default ImageList;
