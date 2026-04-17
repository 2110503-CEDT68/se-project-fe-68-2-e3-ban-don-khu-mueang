import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "../../types/interface";

type BookState = {
  bookItems: BookingItem[];
}

const initialState: BookState = { bookItems: [] }

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      state.bookItems.push(action.payload);
    },
    removeBooking: (state, action: PayloadAction<string>) => {
      state.bookItems = state.bookItems.filter((item) => item._id !== action.payload);
    },
    resetBooking: (state) => {
      state.bookItems = [];
    },
  },
});

export const { addBooking, removeBooking, resetBooking } = bookSlice.actions;

export default bookSlice.reducer;
