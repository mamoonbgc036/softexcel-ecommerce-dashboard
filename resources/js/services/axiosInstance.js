import axios from "axios";
import Cookies from "js-cookie";

// Axios instance configuration
const axiosInstance = axios.create({
    baseURL: "https://admin.pre-flamingos.com/api/v1",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add interceptors for handling the token
axiosInstance.interceptors.request.use((config) => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401: // Unauthorized error
                    console.warn("Token expired or invalid. Logging out...");
                    Cookies.remove("authToken");
                    window.location.href = "/login";
                    break;
                case 500:
                    console.error(
                        "Server error:",
                        error.response.data.message || "Internal Server Error"
                    );
                    break;
                case 404:
                    console.error(
                        "Not found:",
                        error.response.data.message || "Resource not found"
                    );
                    break;
                default:
                    console.error(
                        "Error:",
                        error.response.data.message || "An error occurred"
                    );
            }
        } else {
            console.error("Network error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
