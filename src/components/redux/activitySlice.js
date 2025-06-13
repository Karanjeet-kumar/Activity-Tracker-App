import { createSlice } from "@reduxjs/toolkit";

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    allTrnActivity: [],
    allAssignedActivity: [],
    allVerifierActivity: [],
  },
  reducers: {
    // actions
    setAllTrnActivity: (state, action) => {
      state.allTrnActivity = action.payload;
    },
    setAllAssignedActivity: (state, action) => {
      state.allAssignedActivity = action.payload;
    },
    setAllVerifierActivity: (state, action) => {
      state.allVerifierActivity = action.payload;
    },
  },
});

export const {
  setAllTrnActivity,
  setAllAssignedActivity,
  setAllVerifierActivity,
} = activitySlice.actions;

export default activitySlice.reducer;
