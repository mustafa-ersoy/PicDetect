import {configureStore} from '@reduxjs/toolkit';
import { imagesReducer } from './slices/imagesSlice';
import { userReducer } from './slices/userSlice';

const store = configureStore({
  reducer:{
    images: imagesReducer,
    user: userReducer,
  }
});

export * from './thunks/getImages';
export * from './thunks/fetchUserData';
export {deleteImage} from './slices/imagesSlice';
export {store}