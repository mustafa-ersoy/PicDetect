import { useState } from "react";
import axios from "axios";
import { BiUpload } from 'react-icons/bi';

function DragDrop(){
  const [droppedImages, setDroppedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadFinish, setUploadFinish] = useState(false);

  const handleDragOver = (event)=>{
    event.preventDefault();
  }

  const handleDrop = (event)=>{
    event.preventDefault();
    setUploadFinish(false)
    const newDroppedImages = [...droppedImages];
    for (const file of event.dataTransfer.files){
      newDroppedImages.push(file);
    }
    setDroppedImages(newDroppedImages);
  }

  const handleUpload = async ()=>{
    setUploading(true)
    try{
      const token = localStorage.getItem('token')
      for (const file of droppedImages){
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('http://localhost:8000/api/media/upload/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type' : 'multipart/form-data',
          },
        });
      }
    } catch(error){
      console.error('Upload Error: ', error);
      if (error.response && error.response.status === 401){
        localStorage.removeItem('token');
      }
    } finally {
      setUploading(false);
      setDroppedImages([]);
      setUploadFinish(true);
    }
  }
  
  let content = null;
  if (droppedImages.length === 0){
    content = (
      <div style={{textAlign:'c'}}>
        <div>
          <BiUpload style={{fontSize:'4rem'}} />
        </div>
        <p>Drag Images Here</p>
    </div>)
  }

  return (
    <div>
      {uploadFinish && <div className="upload-success"><p>Images Uploaded succesfully ✅</p></div>}
      <div className="drag-1">
        <h2>Drag and Drop Images</h2>
      </div>
      <div className="drag-2">
        <div className="drop-zone" onDragOver={handleDragOver} onDrop={handleDrop}>
          {content}
          {droppedImages.map((file, index)=>{
            return (
            <div className="dropped-image-div" key={index}>
              <img className="dropped-image" src={URL.createObjectURL(file)} alt={`Dropped Visual ${index}`} />
            </div>)
          })}
        </div>
      </div>
      <div className="drag-button-div">
        <button className="drag-button" onClick={handleUpload} disabled={uploading || droppedImages.length === 0}>
          {uploading ? <span className="spinner"></span> : 'upload'}
        </button>
      </div>
    </div>
  )
}

export default DragDrop;