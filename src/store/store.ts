import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import enrollReducer from "./slices/enrollmentSlice";
import chatReducer from "./slices/aiChatSlice";
import themeReducer from "./slices/themeSlice";
import { injectStore } from "../services/api";

const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    enroll: enrollReducer,
    chat: chatReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

injectStore(store);

export default store;
