import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UI {
    sidebar: boolean;
}

const initialState:UI = {
    sidebar:false,
};

const ui = createSlice({
    name: 'ui',
    initialState: initialState,
    reducers: {
        setSidebar: (state:UI, { payload }: PayloadAction<boolean>) => {
            return {...state, sidebar:payload};
        },
    },
});

export const { setSidebar } = ui.actions;

export default ui.reducer;