import { createSlice } from "@reduxjs/toolkit";

const taskformSlice = createSlice({
  name: "taskForm",
  initialState: {
    taskName: "",
    taskDesc: "",
    allUsers: [],
    assignedUser: "",
    targetDate: "",
  },
  reducers: {
    // actions
    setTaskName: (state, action) => {
      state.taskName = action.payload;
    },
    setTaskDesc: (state, action) => {
      state.taskDesc = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setAssignedUser: (state, action) => {
      state.assignedUser = action.payload;
    },
    setTargetDate: (state, action) => {
      state.targetDate = action.payload;
    },
  },
});

export const {
  setTaskName,
  setTaskDesc,
  setAllUsers,
  setAssignedUser,
  setTargetDate,
} = taskformSlice.actions;

export default taskformSlice.reducer;
