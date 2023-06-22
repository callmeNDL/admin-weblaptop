import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userReducer';
import provinceReducer from './province/provinceReducer';

const rootReducer = combineReducers({
  user: userReducer,
  province: provinceReducer,

});

export default rootReducer;
