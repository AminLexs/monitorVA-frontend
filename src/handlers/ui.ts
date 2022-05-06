import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Locale } from 'enums/Locale';

export interface UI {
  sidebar: boolean;
  locale: Locale;
}

const initialState: UI = {
  sidebar: false,
  locale: Locale.Ru,
};

const ui = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    setSidebar: (state: UI, { payload }: PayloadAction<boolean>) => {
      return { ...state, sidebar: payload };
    },
    setLocale: (state: UI, { payload }: PayloadAction<Locale>) => {
      return { ...state, locale: payload };
    },
  },
});

export const { setSidebar, setLocale } = ui.actions;

export default ui.reducer;
