import api from "./api";

const paymentService = {
  createPaymentSession: async (courseId: string) => {
    const response = await api.post("/payment/create-session", { courseId });
    return response.data.data;
  },

  verifyPayment: async (sessionId: string) => {
    const response = await api.post("/payment/verify", { sessionId });
    return response.data.data;
  },
};

export default paymentService;
