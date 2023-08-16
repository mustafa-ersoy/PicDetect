import { createSlice } from '@reduxjs/toolkit';
import { getImages } from '../thunks/getImages';

const imagesSlice = createSlice({
  name:'images',
  initialState: {
    data:[],
    loading: false,
    error:null,
  },
  reducers:{
    deleteImage: (state, action)=>{
      const index = action.payload;
      state.data.splice(index, 1);
    }
  },
  extraReducers(builder){
    builder
    .addCase(getImages.pending, (state, action)=>{
      state.loading=true
    })
    .addCase(getImages.fulfilled, (state, action)=>{
      state.loading = false
      state.data = action.payload
    })
    .addCase(getImages.rejected, (state, action)=>{
      state.loading = false
      state.error = action.error.message
    })
  }
  });

export const {deleteImage} = imagesSlice.actions;
export const imagesReducer = imagesSlice.reducer;
