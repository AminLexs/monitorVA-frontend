import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Auth {
    email: string;
    password: string;
}

const initialState:Auth = {
    email:'',
    password:'',
};

const auth = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setEmail: (state:Auth, { payload }: PayloadAction<string>) => {
            return {...state, email:payload};
        },
        setPassword: (state:Auth, { payload }: PayloadAction<string>) => {
            return {...state, password:payload};
        },
    },
});

export const { setEmail, setPassword } = auth.actions;

export default auth.reducer;