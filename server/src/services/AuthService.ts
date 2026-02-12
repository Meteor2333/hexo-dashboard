import type Hexo from 'hexo';

import { compareSync } from 'bcryptjs';

export default class AuthService {
  private readonly users: Record<string, string> = {};

  constructor(
    private hexo: Hexo,
  ) {
    const config = this.hexo.config.dashboard;
    for (const name in config) {
      this.users[name.toLowerCase()] = config[name];
    }
  }

  authenticate(username: string, password: string) {
    const target = this.users[username.toLowerCase()];
    if (!target) return false;
    return compareSync(password, target);
  }
};
