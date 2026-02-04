import request from '@/request';
import type { Config } from '@/../types/api';

export default {
  getConfig() {
    return request.get<Config, Config>('config', { params: { type: 'themeconfig' } });
  },

  updateConfig(config: string) {
    return request.post<void, void>('config', { config }, { params: { type: 'themeconfig' } });
  },
};
