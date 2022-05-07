import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Locale } from 'enums/Locale';

export interface UI {
  sidebar: boolean;
  locale: Locale;
  loading: boolean;
}

const initialState: UI = {
  sidebar: false,
  locale: Locale.Ru,
  loading: false,
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
    setLoading: (state: UI, { payload }: PayloadAction<boolean>) => {
      return { ...state, loading: payload };
    },
  },
});

export const { setSidebar, setLocale, setLoading } = ui.actions;

export default ui.reducer;
