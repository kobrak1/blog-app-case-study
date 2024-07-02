import { combineReducers } from "@reduxjs/toolkit";
import blogSlice from "./slices/blogSlice";

const rootReducer = combineReducers({
    blog: blogSlice,
})

export default rootReducer