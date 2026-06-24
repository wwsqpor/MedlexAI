import { createSlice } from "@reduxjs/toolkit"

import { 
  askAi,
  fetchChatHistory
} from "./aiTutorThunks"


const initialState = {
  messages: [],
  messagesStatus: "idle",
  messagesError: "",

  sendMessageStatus: "idle",
  sendMessageError: "",

  isTyping: false,
}

const aiTutor = createSlice({
  name: "aiTutor",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(askAi.pending, (state) => {
      state.sendMessageStatus = "loading";
      state.sendMessageError = "";
      state.isTyping = true;
    })
    .addCase(askAi.rejected, (state, action) => {
      state.sendMessageStatus = "failed";
      state.sendMessageError = action.payload;
      state.isTyping = false;
    })
    .addCase(askAi.fulfilled, (state, action) => {
      state.sendMessageStatus = "succeeded";
      state.messages.push(action.payload);
      state.isTyping = false;
    })
    .addCase(fetchChatHistory.pending, (state) => {
      state.messagesStatus = "loading";
      state.messagesError = "";
    })
    .addCase(fetchChatHistory.rejected, (state, action) => {
      state.messagesStatus = "failed";
      state.messagesError = action.payload;
    })
    .addCase(fetchChatHistory.fulfilled, (state, action) => {
      state.messagesStatus = "succeeded";
      state.messages = action.payload;
    })
  }
})


export default aiTutor.reducer;
export const { addMessage } = aiTutor.actions;