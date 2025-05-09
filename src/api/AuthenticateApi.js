import Instance from "../axios/Instance";

export const registerAccount = async (data) => {
    const url = `/api/v1/user/create`;
    return await Instance.post(url, data);
};
export const sendOtp = async (data) => {
    const url = "/api/v1/user/send-otp";
    return await Instance.post(url, data);
};

export const verifyOtp = async (data) => {
    const url = "/api/v1/user/verify-otp";
    return await Instance.post(url, data);
};

export const signIn = async (data) => {
    const url = "/api/v1/user/login";
    return await Instance.post(url, data);
};
export const changePassword = async (data) => {
    const url = "/api/v1/user/change-password";
    return await Instance.put(url, data);
};

export const forgotPassword = async (data) => {
    const url = "/api/v1/user/forgot-password";
    return await Instance.post(url, data);
};
export const updatepProfile = async (data) => {
    const url = `/api/v1/user/update-profile`;
    return await Instance.put(url, data);
};
