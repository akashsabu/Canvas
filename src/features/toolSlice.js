import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  tool: "rectangle",
  stroke_width: 1,
  color: "#000000",
  fillColor: "#000000",

};

export const toolSlice = createSlice({
  name: "toolProps",
  initialState: {
    value: initialStateValue,
  },
  reducers: {
    setTool: (state, action) => {
      state.value.tool = action.payload;
    },
    setStroke: (state, action) => {
      state.value.stroke_width = action.payload;
    },
    setColor: (state, action) => {
      state.value.color = action.payload;
    },
    setFillColor: (state, action) => {
      state.value.fillColor = action.payload;
    },
  },
});

export const { setTool,setStroke, setColor,setFillColor } = toolSlice.actions;

export default toolSlice.reducer;
