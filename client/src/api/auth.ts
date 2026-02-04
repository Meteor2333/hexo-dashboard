import request from '@/request';

export default {
  authenticate(username: string, password: string) {
    return request.post<void, void>('auth', { username, password });
  },
};
