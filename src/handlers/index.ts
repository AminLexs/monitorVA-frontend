import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './auth';
import uiReducer from './ui';

const appReducer = combineReducers({
    auth:authReducer,
    ui: uiReducer,
  //stages: stagesReducer,
});

const rootReducer = combineReducers({ app: appReducer });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
export type AppState = RootState['app'];
