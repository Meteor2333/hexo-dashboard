import type Hexo from 'hexo';

import { compareSync } from 'bcryptjs';

export default class AuthService {
  constructor(
    private hexo: Hexo,
  ) {
  }

  authenticate(username: string, password: string): boolean {
    const target = this.hexo.config.dashboard[username];
    if (!target) return false;
    return compareSync(password, target);
  }
};
