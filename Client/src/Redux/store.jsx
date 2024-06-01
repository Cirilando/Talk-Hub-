  import { configureStore } from "@reduxjs/toolkit";
  import userReducer from "./userSlice";

  export const Storage = configureStore({
    reducer: {
      user: userReducer,
    },
  });
