import { createSlice } from "@reduxjs/toolkit";

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    allTrnActivity: [],
    allAssignedActivity: [],
  },
  reducers: {
    // actions
    setAllTrnActivity: (state, action) => {
      state.allTrnActivity = action.payload;
    },
    setAllAssignedActivity: (state, action) => {
      state.allAssignedActivity = action.payload;
    },
  },
});

export const { setAllTrnActivity, setAllAssignedActivity } =
  activitySlice.actions;

export default activitySlice.reducer;
