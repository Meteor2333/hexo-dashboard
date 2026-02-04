import type Hexo from 'hexo';

import { compareSync } from 'bcryptjs';

export default class AuthService {
  constructor(
    private hexo: Hexo,
  ) {
  }

  // todo: username目前没用 给未来支持多用户做准备
  authenticate(username: string, password: string): boolean {
    void username;
    const hash = this.hexo.config.dashboard.password_hash;
    if (!compareSync(password, hash)) return false;
    return true;
  }
};
