import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    allAssignedTask: [],
  },
  reducers: {
    // actions
    setAllAssignedTask: (state, action) => {
      state.allAssignedTask = action.payload;
    },
  },
});

export const { setAllAssignedTask } = taskSlice.actions;

export default taskSlice.reducer;
