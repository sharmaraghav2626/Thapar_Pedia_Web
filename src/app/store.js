import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import questionReducer from '../features/quesionSlice';
import questionModalReducer from '../features/questionModalSlice';
import navBarTypeReducer from '../features/navBarSlice';
import searchTermReducer from '../features/searchTerm';

export const store = configureStore({
  reducer: {
    user: userReducer,
    question:questionReducer,
    questionModal:questionModalReducer,
    navBarType:navBarTypeReducer,
    searchTerm:searchTermReducer
  },
});
