import { AlertProps } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setAppError } from "./appErrorSlice";

const MaxNotificationMessageCount = 50;

export interface NotificationMessage {
  id?: string;
  message: string;
  severity?: AlertProps["severity"];
}

interface NotificationState {
  messages: NotificationMessage[];
}

const initialState: NotificationState = {
  messages: [],
};

const notificationSlice = createSlice({
  initialState,
  name: "notifications",
  reducers: {
    removeNotifiction: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (notification) => notification.id != action.payload,
      );
    },
    resetNofications: () => initialState,
    setNotifications: (state, action: PayloadAction<NotificationMessage>) => {
      if (!action.payload.id) action.payload.id = new Date().toISOString();
      state.messages.push(action.payload);
      if (state.messages.length > MaxNotificationMessageCount)
        state.messages.shift();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setAppError, (state, action) => {
      state.messages.push({ ...action.payload, id: new Date().toISOString() });
      if (state.messages.length > MaxNotificationMessageCount)
        state.messages.shift();
    });
  },
});

export const { removeNotifiction, resetNofications, setNotifications } =
  notificationSlice.actions;
export const notificationsReducer = notificationSlice.reducer;
