import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  globalLoading: boolean;
  globalError: string | null;
}

const initialState: UIState = {
  globalLoading: false,
  globalError: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: any) => {
      state.globalLoading = action.payload;
    },
    setGlobalError: (state, action: any) => {
      state.globalError = action.payload;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },
  },
});

export const { setGlobalLoading, setGlobalError, clearGlobalError } = uiSlice.actions;
export default uiSlice.reducer;