import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface PopupInterface {
  postId: number | null;
}

const initialState: PopupInterface = {
  postId: null,
};

export const postToEditSlice = createSlice({
  name: "postToEdit",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setPostToEdit: (state, action: PayloadAction<number>) => {
      state.postId = action.payload;
    },
    clearPostToEdit: (state) => {
      state.postId = null;
    },
  },
});

export const { setPostToEdit } = postToEditSlice.actions;

export const getIsAskToLoginPopupOpen = (state: RootState) =>
  state.askToLoginPopup.isOpen;

export default postToEditSlice.reducer;
