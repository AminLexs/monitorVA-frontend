import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardStep } from 'enums/DashboardStep';

interface StagesState {
  currentDashboardStep: DashboardStep | null;
}

const initialState: StagesState = {
  currentDashboardStep: null,
};

const stages = createSlice({
  name: 'stages',
  initialState,
  reducers: {
    setDashboardStep(state, { payload }: PayloadAction<DashboardStep | null>) {
      state.currentDashboardStep = payload;
    },
  },
});

export const { setDashboardStep } = stages.actions;

export default stages.reducer;
