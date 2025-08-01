import axios from "axios";
import { logout } from "../store/slices/authSlice";
import store from "../store";

const instance = axios.create({
    baseURL:'http://localhost:8000',
});

//send cookie in all requests
instance.defaults.withCredentials = true;

//interceptor proceed refresh
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                //call refresh
                await instance.post("/refresh/");
                //return old request
                return instance(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed");
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default instance;