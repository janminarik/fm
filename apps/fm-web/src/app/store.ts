import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { apiAdSpace } from "../features/ad-space/api/apiAdSpace";
import { adSpacesReducer } from "../features/ad-space/slices/ad-spacesSlice";
import { apiAuth } from "../features/auth/api/apiAuth";
import { apiCustomers } from "../features/customers/api/customersApi";
import { customersReducer } from "../features/customers/slices/customersSlice";
import { settingsPanelReducer } from "../features/settings/slices/settingsPanelSlice";
import { uiSettingsReducer } from "../features/settings/slices/uiSettingsSlice";
import { apiUser } from "../features/user/api/userApi";
import { errorMiddleware } from "../shared/middleware/errorMiddleware";
import { applicationErrorReducer } from "../shared/slices/appErrorSlice";
import { navigationPanelReducer } from "../shared/slices/navigationPanelSlice";
import { notificationsReducer } from "../shared/slices/notificationSlice";

const rootReducer = combineReducers({
  adSpacesList: adSpacesReducer,
  [apiAdSpace.reducerPath]: apiAdSpace.reducer,
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiCustomers.reducerPath]: apiCustomers.reducer,
  [apiUser.reducerPath]: apiUser.reducer,
  customersList: customersReducer,
  appError: applicationErrorReducer,
  //perzistentne reduktory
  navigationPanel: navigationPanelReducer,
  notifications: notificationsReducer,
  settingsPanel: settingsPanelReducer,
  uiSettings: uiSettingsReducer,
});

// Spoločná konfigurácia persist pre reduktory
const persistConfig = {
  key: "root",
  storage, //local storage
  whitelist: ["navigationPanel", "settingsPanel", "uiSettings"],
};

// Aplikácia persistReducer na kombinovaný rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Konfigurácia store
export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
      //
    }).concat([
      errorMiddleware,
      apiAuth.middleware,
      apiUser.middleware,
      apiCustomers.middleware,
      apiAdSpace.middleware,
    ]),
  reducer: persistedReducer,
});

// Konfigurácia persistoru
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
