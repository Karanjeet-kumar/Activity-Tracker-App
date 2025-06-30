import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    allCategories: [],
    selectedCategory: "",
    allActivities: [],
    selectedActivity: "",
    allDepartments: [],
    allUsers: [],
    assignedUser: "",
    allVerifiers: [],
    assignedVerifier: "",
    targetDate: "",
    notes: "",
  },
  reducers: {
    // actions
    setAllCategories: (state, action) => {
      state.allCategories = action.payload;
    },
    setAllActivities: (state, action) => {
      state.allActivities = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedActivity: (state, action) => {
      state.selectedActivity = action.payload;
    },
    setAllDepartments: (state, action) => {
      state.allDepartments = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setAssignedUser: (state, action) => {
      state.assignedUser = action.payload;
    },
    setAllVerifiers: (state, action) => {
      state.allVerifiers = action.payload;
    },
    setAssignedVerifier: (state, action) => {
      state.assignedVerifier = action.payload;
    },
    setTargetDate: (state, action) => {
      state.targetDate = action.payload;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
  },
});

export const {
  setAllCategories,
  setSelectedCategory,
  setAllActivities,
  setSelectedActivity,
  setAllDepartments,
  setAllUsers,
  setAssignedUser,
  setAllVerifiers,
  setAssignedVerifier,
  setTargetDate,
  setNotes,
} = formSlice.actions;

export default formSlice.reducer;
