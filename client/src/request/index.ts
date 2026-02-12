import router from '@/router';
import axios from 'axios';
import { ElMessage, ElNotification } from 'element-plus';
import { ref } from 'vue';

const root = new URL(import.meta.env.BASE_URL, location.origin);
const service = axios.create({ 'baseURL': `${new URL('api', root).href}`, 'timeout': 10000 });

service.interceptors.response.use(
  response => {
    if (response.status === 201) {
      const location = response.headers['location'];
      if (location) router.push(location);
    }

    return response.data;
  },
  error => {
    const response = error.response;
    if (response) {
      const data = response.data;
      const code = data.code || response.status;
      const message = data.msg || response.statusText;
      switch (code) {
        case 401:
          unauthorized.value = true;
          break;
        case 500:
          ElNotification.error({ title: 'Error', message: message, duration: 0 });
          break;
        default:
          ElMessage.error(message);
          break;
      }
    }

    return Promise.reject(error);
  },
);

export default service;
export const unauthorized = ref(false);
