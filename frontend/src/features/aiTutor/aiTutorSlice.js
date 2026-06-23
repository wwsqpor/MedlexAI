import { createSlice } from "@reduxjs/toolkit"

import { 
  askAi
} from "./aiTutorThunks"


const initialState = {
  messages: [],

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
  }
})


export default aiTutor.reducer;
export const { addMessage } = aiTutor.actions;