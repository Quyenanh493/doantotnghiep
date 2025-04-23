import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search/searchSlice';

// Thêm các reducer khác ở đây nếu bạn có
const store = configureStore({
  reducer: {
    search: searchReducer,
    // các reducer khác...
  }
});

export default store;