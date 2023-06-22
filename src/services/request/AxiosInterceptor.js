import axios from "axios";

const httpAxios = () => {
  // Add a request interceptor
  axios.interceptors.request.use((config) => {
    // Do something before request is sent
    return config;
  }, (error) => {
    // Do something with request error
    return Promise.reject(error);
  });
}

export default httpAxios