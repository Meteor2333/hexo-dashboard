import type Hexo from 'hexo';

import { dirname, join } from 'path';
import { exists, readFile, writeFile } from 'hexo-fs';

export default class ConfigService {
  private hexo: Hexo;
  private paths: string[];
  private loadFunc: (hexo: Hexo) => Promise<void>;

  constructor(hexo: Hexo, type: 'mainconfig' | 'themeconfig') {
    this.hexo = hexo;
    const path = dirname(require.resolve('hexo'));
    switch (type) {
      case 'mainconfig':
        this.paths = [hexo.config_path];
        this.loadFunc = async (hexo: Hexo) => {
          return (await import(join(path, 'load_config'))).default(hexo);
        };
        break;
      case 'themeconfig':
        this.paths = [
          join(hexo.base_dir, `_config.${hexo.config.theme}.yml`),
          join(hexo.theme_dir, '_config.yml'),
        ];
        this.loadFunc = async (hexo: Hexo) => {
          return (await import(join(path, 'load_config'))).default(hexo);
        };
        break;
      default:
        this.paths = [];
        this.loadFunc = async () => {};
    }
  }

  async getConfig(): Promise<string | undefined> {
    for (const path of this.paths) {
      if (await exists(path)) {
        return readFile(path);
      }
    }

    return undefined;
  }

  async updateConfig(data: string) {
    for (const path of this.paths) {
      if (await exists(path)) {
        await writeFile(path, data);
      }
    }

    await this.loadFunc(this.hexo);
    await this.hexo.load();
  }
};
