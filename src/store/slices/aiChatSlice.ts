import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import aiService from "../../services/aiService";
import type { Message, ChatState, ChatRequest } from "../../types";
import { getErrorMessage } from "../../lib/error";

const initialState: ChatState = {
  messages: [
    {
      id: "welcome",
      content: "Hi! I'm your AI learning assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ],
  isOpen: false,
  isTyping: false,
  error: null,
};

export const sendChatMessage = createAsyncThunk<
  string,
  ChatRequest,
  { rejectValue: string }
>("chat/sendMessage", async (reqMsg, thunkAPI) => {
  try {
    return await aiService.chat(reqMsg);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to connect to AI")
    );
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    addUserMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetChat: (state) => {
      state.messages = initialState.messages;
      state.error = null;
      state.isTyping = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: action.payload,
          role: "assistant",
          timestamp: new Date().toISOString(),
        };
        state.messages.push(assistantMessage);
      })
      .addCase(sendChatMessage.rejected, (state) => {
        state.isTyping = false;
        state.error = "Failed to process";
      });
  },
});

export const {
  toggleChat,
  openChat,
  closeChat,
  addUserMessage,
  clearError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
