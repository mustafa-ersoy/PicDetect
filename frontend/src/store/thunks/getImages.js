import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


export const getImages = createAsyncThunk('images/get', async (searchTerm, thunkAPI)=>{
  const token = localStorage.getItem('token');
  try{

    const response = await axios.get('http://localhost:8000/api/media/getImages/', {
      headers:{
        Authorization : `Bearer ${token}`},
        params:{
          search:searchTerm
      }
    
    });
    return response.data
  } catch(error){
    if (error.response && error.response.status === 401){
      localStorage.removeItem('token')}
      return thunkAPI.rejectWithValue(error.response.data);
  }
})