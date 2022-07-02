import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface PopupInterface {
  isOpen: boolean;
}

// Define the initial state using that type
const initialState: PopupInterface = {
  isOpen: false,
};

export const tokenSlice = createSlice({
  name: "askToLoginPopup",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setAskToLoginPopup: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setAskToLoginPopup } = tokenSlice.actions;

export const getIsAskToLoginPopupOpen = (state: RootState) =>
  state.askToLoginPopup.isOpen;

export default tokenSlice.reducer;
