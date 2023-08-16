import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserData = createAsyncThunk('user/fetchUserData', async ()=>{
  const token = localStorage.getItem('token')
  try{
  const response = await axios.get('http://localhost:8000/api/user/account/', {
    headers:{
      Authorization : `Bearer ${token}`,
    }
  });
  return response.data;
  }catch(error){
    if (error.response && error.response.status === 401){
      localStorage.removeItem('token');
    }
  }
} )
