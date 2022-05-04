import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Auth {
  user: any;
}

const initialState: Auth = {
  user: null,
};

const auth = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser: (state: Auth, { payload }: PayloadAction<any>) => {
      return { ...state, user: payload };
    },
  },
});

export const { setUser } = auth.actions;

export default auth.reducer;
