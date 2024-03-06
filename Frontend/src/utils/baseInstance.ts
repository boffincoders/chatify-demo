import axios, { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
export const base_url = process.env.REACT_APP_CHAT_DEMO_FRONTEND_BASE_URL;
const axiosInstance = axios.create({
  baseURL: base_url,
});

const requestHandler = (request: any) => {
  const currentUser: any = JSON.parse(localStorage.getItem("loggedInUser")!);
  try {
    if (
      currentUser &&
      currentUser?.token !== undefined &&
      currentUser?.token !== ""
    )
      request.headers["Authorization"] = currentUser
        ? "Bearer " + currentUser?.token
        : "";
  } catch (e) {
    console.log(e, "err");
  }
  return request;
};
const responseHandler = (response: any) => {
  return response;
};
axiosInstance.interceptors.request.use(requestHandler, (error: AxiosError) => {
  Promise.reject(error);
});
axiosInstance.interceptors.response.use(
  responseHandler,
  (error: AxiosError) => {
    if (error.response && error.response.status !== StatusCodes.UNAUTHORIZED) {
      if (error.response.data) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
    if (error.response && error.response.status === StatusCodes.UNAUTHORIZED) {
      if (error.response.status === 401) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/login";
        if (error.response.data) return Promise.reject(error.response.data);
        return Promise.reject(error);
      }
    } else if (
      error.response &&
      error.response.status === StatusCodes.INTERNAL_SERVER_ERROR
    ) {
    }
  }
);

export default axiosInstance;
