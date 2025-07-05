import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  code: "",         
  language: "cpp", 
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    resetCode: (state) => {
      state.code = "";
      state.language = "cpp";
    },
  },
});

export const { setCode, setLanguage, resetCode } = codeSlice.actions;
export default codeSlice.reducer;
