import { tokenSlice } from "./slices/user";
import { configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";
import exp from "constants";
import askToLoginPopup from "./slices/askToLoginPopup";
import postToEdit from "./slices/postToEdit";

const persistConfig = {
  key: "blog-node-app-redux-persist-key",
  storage,
};

const userPersisterReducer = persistReducer(persistConfig, tokenSlice.reducer);

const store = configureStore({
  reducer: {
    user: userPersisterReducer,
    askToLoginPopup: askToLoginPopup,
    postToEdit,
  },
});

const persistor = persistStore(store);

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
