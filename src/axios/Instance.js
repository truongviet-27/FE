import axios from "axios";
import qs from "qs";
import { refreshToken } from "../api/AuthenticateApi";
import Cookies from "js-cookie";
const Instance = axios.create({
    baseURL: "http://localhost:8080",
    paramsSerializer: (params) =>
        qs.stringify(params, {
            skipNulls: true,
            arrayFormat: "comma",
        }),
});

Instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token"); // Lấy token từ localStorage
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi 401 và làm mới access token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

Instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Đợi token mới từ queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(Instance(originalRequest));
                        },
                        reject: (err) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await refreshToken({
                    refreshToken: Cookies.get("refreshToken"),
                }); // gọi refresh token
                const newAccessToken = res.data.data;
                localStorage.setItem("token", newAccessToken);

                Instance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return Instance(originalRequest); // ← gọi lại request cũ
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default Instance;
