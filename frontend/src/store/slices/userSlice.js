import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData } from "../thunks/fetchUserData";

const userSlice = createSlice({
  name:'user',
  initialState:{
    data:null,
    loading:false,
    error:null,
  },
  extraReducers(builder){
    builder
    .addCase(fetchUserData.pending, (state, action)=>{
      state.loading = true
    })
    .addCase(fetchUserData.fulfilled, (state, action)=>{
      state.loading = false
      state.data = action.payload
    })
    .addCase(fetchUserData.rejected, (state, action)=>{
      state.loading = false
      state.error = action.error.message
    })
  }
})
export const userReducer = userSlice.reducer;
