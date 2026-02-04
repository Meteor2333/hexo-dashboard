import axios from 'axios';
import { ref } from 'vue';

const service = axios.create({ 'baseURL': './api', 'timeout': 10000 });

service.interceptors.response.use(
  response => response.data,
  error => {
    const response = error.response;
    if (response) {
      const data = response.data;
      const code = data.code;
      const message = data.msg;
      if (code === 401) {
        unauthorized.value = true;
      } else if (response.status === code) {
        console.error(`Response Error: ${message} (code: ${code})`);
      }
    }

    return Promise.reject(error);
  },
);

export default service;
export const unauthorized = ref(false);
