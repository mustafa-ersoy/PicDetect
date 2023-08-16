import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Navbar from '../components/Navbar';
import { fetchUserData } from '../store';
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

export default function Account({onLogout}){
  const navigate = useNavigate();
  const {data:userData, loading, error} = useSelector((state)=>state.user)
  const dispatch = useDispatch();

  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);


  const handleImageChange = (event)=>{
    const selectedImage = event.target.files[0];
    if (selectedImage){
      setSelectedImageFile(selectedImage);
      const imageURL = URL.createObjectURL(selectedImage);
      setSelectedImageUrl(imageURL);
    }
  }

  const handleImageUpload = async ()=>{
    try{
      setUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profile_image', selectedImageFile);
      await axios.patch('http://localhost:8000/api/user/update_picture/', formData, {
        headers:{
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
    }catch(error){
      console.error('Image upload error:', error);
    }finally{
      setUploading(false)
      setSelectedImageUrl('');
      window.location.reload();
    }
  }
  
  useEffect(()=>{
    dispatch(fetchUserData())
  }, [dispatch]);

  const handleLogout = async ()=>{
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8000/api/user/logout/', {}, {
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    onLogout();
    navigate('/login');
    }

  let content = <div></div>
  if (loading){content = <div><h1>Loading User Data..</h1></div>}
  else if (error){
    content = <div>{error}</div>
    if (error.response && error.response.status === 401){
      localStorage.removeItem('token');
    }
  }
  else if (userData !== null){
    content = (
      <div className='account-main'>
        <input
        type="file"
        id="imageInput"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
          <div className='account-image-div'>
            <div className='account-image-container'>
              <img className='account-image' src={`http://localhost:8000${userData.profile_image}?${Date.now()}`} alt='profile' />
              <button className='image-button' onClick={() => document.getElementById('imageInput').click()} >
                <FaEdit style={{fontSize:'24px'  , color:'black'}} />
              </button>
            </div>
          </div>
          {selectedImageUrl && (
          <div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <img src={selectedImageUrl} style={{width:'150px', margin:'20px'}} alt='Selected' />
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <button className='profile-upload-button' onClick={handleImageUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Update'}
              </button>
            </div>
          </div>
        )}
          <div className='account-name'><h1>{userData.name}</h1></div>
          <div className='table-div'>
            <table className='striped-table'>
              <tbody>
                <tr>
                  <td>Email:</td>
                  <td>{userData.email}</td>
                </tr>
                <tr>
                  <td>Number of Images:</td>
                  <td>{userData.image_count}</td>
                </tr>
                <tr>
                  <td>Total Usage:</td>
                  <td>{userData.total_usage.toFixed(2)} MB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='logout-div'>
            <button className='logout-button' onClick={handleLogout}>Logout</button>
          </div>
      </div>
    )
  }

  return <div>
      <Navbar />
      <div>
        {content}
      </div>
    </div>
}