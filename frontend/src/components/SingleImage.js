import { BiSolidDownload } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { deleteImage } from '../store';
import axios from 'axios';

function SingleImage({image, index}){
  const dispatch = useDispatch();

  const handleDownload = async (imageName)=>{
    try{
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/media/download/${imageName}/`, {
      headers:{
        Authorization:`Bearer ${token}`,
      },
      responseType:'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', imageName);
      document.body.appendChild(link);
      link.click();
    }catch(error){
      console.error('Download error', error);
      if (error.response && error.response.status === 401){
        localStorage.removeItem('token');
      }
    }
  }

  const handleDelete = async ()=>{
    try{
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/media/delete/`, {
        headers:{
          Authorization : `Bearer ${token}`,
        },
        params:{
          id:image.id
        }
      })
    }catch(error){
      console.error('Error deleting image:', error);
      if (error.response && error.response.status === 401){
        localStorage.removeItem('token');
      }
    }
    dispatch(deleteImage(index));
  }

  return (
  <div className='image-container'>
    <div className='image-container-2'>
      <img className='single-image' src={`http://localhost:8000${image.image}`} alt={image.name} />
    </div>
    <div className='icons'>
      <RiDeleteBin6Line className='icon' onClick={handleDelete} />
      <BiSolidDownload className='icon' onClick={()=>handleDownload(image.name)} />
    </div>
  </div>);
}

export default SingleImage;
