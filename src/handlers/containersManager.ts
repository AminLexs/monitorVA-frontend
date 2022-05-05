import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContainersManager {
  selectedContainers: Array<string>;
}

const initialState: ContainersManager = {
  selectedContainers: [],
};

const containersManager = createSlice({
  name: 'containersManager',
  initialState: initialState,
  reducers: {
    setSelectedContainers: (state: ContainersManager, { payload }: PayloadAction<Array<string>>) => {
      return { ...state, selectedContainers: payload };
    },
  },
});

export const { setSelectedContainers } = containersManager.actions;

export default containersManager.reducer;
