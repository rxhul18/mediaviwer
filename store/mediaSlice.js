import { createSlice } from "@reduxjs/toolkit";

// Initial state of the media store
const initialState = {
  files: [],  
  activeFileId: null,
  timelineScale: 10,
  isPlaying: false,
  currentTime: 0,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    addMediaFile: (state, action) => {
      state.files.push(action.payload);
    },

    removeMediaFile: (state, action) => {
      const fileId = action.payload;
      state.files = state.files.filter((file) => file.id !== fileId);

      if (state.activeFileId === fileId) {
        state.activeFileId = null;
      }
    },

    setActiveFile: (state, action) => {
      state.activeFileId = action.payload;
      state.currentTime = 0;
      state.isPlaying = false;
    },

    updateTrimTimes: (state, action) => {
      const { id, startTime, endTime } = action.payload;
      const file = state.files.find((f) => f.id === id);

      if (file) {
        file.startTime = startTime;
        file.endTime = endTime;
      }
    },

    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },

    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
  },
});

export const {
  addMediaFile,
  removeMediaFile,
  setActiveFile,
  updateTrimTimes,
  setPlaying,
  setCurrentTime,
} = mediaSlice.actions;

export default mediaSlice.reducer;
