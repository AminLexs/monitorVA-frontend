import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContainersManager {
  currentContainerID: string | null;
  selectedContainers: Array<string>;
}

const initialState: ContainersManager = {
  currentContainerID: null,
  selectedContainers: [],
};

const containersManager = createSlice({
  name: 'containersManager',
  initialState: initialState,
  reducers: {
    setCurrentContainerID: (state: ContainersManager, { payload }: PayloadAction<string | null>) => {
      return { ...state, currentContainerID: payload };
    },
    setSelectedContainers: (state: ContainersManager, { payload }: PayloadAction<Array<string>>) => {
      return { ...state, selectedContainers: payload };
    },
  },
});

export const { setCurrentContainerID, setSelectedContainers } = containersManager.actions;

export default containersManager.reducer;
