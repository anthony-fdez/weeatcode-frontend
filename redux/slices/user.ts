import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface TokenStateInterface {
  jwtToken: string | null;
  isLogedIn: boolean;
}

// Define the initial state using that type
const initialState: TokenStateInterface = {
  jwtToken: null,
  isLogedIn: false,
};

export const tokenSlice = createSlice({
  name: "token",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setToken: (state, action: PayloadAction<string>) => {
      state.jwtToken = action.payload;
    },
    setIsLogedIn: (state, action: PayloadAction<boolean>) => {
      state.isLogedIn = action.payload;
    },
  },
});

export const { setToken, setIsLogedIn } = tokenSlice.actions;

export const getJwtToken = (state: RootState) => state.user.jwtToken;
export const getIsLogedIn = (state: RootState) => state.user.isLogedIn;

export default tokenSlice.reducer;
