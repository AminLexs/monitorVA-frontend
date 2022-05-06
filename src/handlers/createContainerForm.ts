import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CreateContainerForm {
  imageName: string;
  containerName?: string;
  publicPort?: string;
  privatePort?: string;
}

const initialState: CreateContainerForm = {
  imageName: '',
};

const createContainerForm = createSlice({
  name: 'createContainerForm',
  initialState: initialState,
  reducers: {
    setImageName: (state: CreateContainerForm, { payload }: PayloadAction<string>) => {
      return { ...state, imageName: payload };
    },
    setContainerName: (state: CreateContainerForm, { payload }: PayloadAction<string>) => {
      return { ...state, containerName: payload };
    },
    setPublicPort: (state: CreateContainerForm, { payload }: PayloadAction<string>) => {
      return { ...state, publicPort: payload };
    },
    setPrivatePort: (state: CreateContainerForm, { payload }: PayloadAction<string>) => {
      return { ...state, privatePort: payload };
    },
  },
});

export const { setImageName, setContainerName, setPublicPort, setPrivatePort } = createContainerForm.actions;

export default createContainerForm.reducer;
