import api from "./api";

const aiService = {
  chat: async (data: { text: string; maxTokens?: number }) => {
    const response = await api.post("/ai/chat", data);
    return response.data.data;
  },
};

export default aiService;
