import Instance from "../axios/Instance";

export const generatePaymentUrl = async (data) => {
    return await Instance.post(`/api/v1/payment/generate-payment-url`, data);
};
