import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  name: "canvas",
  height: 400,
  width: 500,

};

export const projectSlice = createSlice({
  name: "projectProps",
  initialState: {
    value: initialStateValue,
  },
  reducers: {
    setProjectProps: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setProjectProps } = projectSlice.actions;

export default projectSlice.reducer;
