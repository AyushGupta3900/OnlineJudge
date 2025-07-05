import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  problems: {}, 
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setCode: (state, action) => {
      const { problemId, code } = action.payload;
      if (!state.problems[problemId]) {
        state.problems[problemId] = { code: "", language: "cpp" };
      }
      state.problems[problemId].code = code;
    },
    setLanguage: (state, action) => {
      const { problemId, language } = action.payload;
      if (!state.problems[problemId]) {
        state.problems[problemId] = { code: "", language: "cpp" };
      }
      state.problems[problemId].language = language;
    },
    resetCode: (state, action) => {
      const { problemId } = action.payload;
      state.problems[problemId] = { code: "", language: "cpp" };
    },
    resetAll: (state) => {
      state.problems = {};
    },
  },
});

export const { setCode, setLanguage, resetCode, resetAll } = codeSlice.actions;

export default codeSlice.reducer;
