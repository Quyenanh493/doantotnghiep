import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dateIn: null,
  dateOut: null,
  guestCounts: {
    rooms: 1,
    adults: 2,
    children: 0
  },
  roomType: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchDates: (state, action) => {
      state.dateIn = action.payload.dateIn;
      state.dateOut = action.payload.dateOut;
    },
    setGuestCounts: (state, action) => {
      state.guestCounts = action.payload;
    },
    setRoomType: (state, action) => {
      state.roomType = action.payload;
    },
    resetSearch: () => initialState
  }
});

export const { setSearchDates, setGuestCounts, setRoomType, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;