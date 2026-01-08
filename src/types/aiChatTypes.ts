export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;
  error: string | null;
}

export interface ChatRequest {
  text: string;
  maxTokens?: number;
}
