# Hexo Dashboard

A Vue-based dashboard for managing your [Hexo](https://hexo.io/) blog. Edit posts, pages, and configurations directly from the browser.

一个基于 Vue 的 [Hexo](https://hexo.io/zh-cn/) 博客管理面板。在浏览器中直接编辑文章、页面和配置。

## Features | 功能特点

- 📝 **Post & Page Management** - Create, edit, and delete  
  管理文章与页面 - 创建、编辑和删除

- ⚙️ **Configuration Editor** - Edit `_config.yml` and theme config  
  配置编辑器 - 编辑站点配置和主题配置

- 🔐 **Password Protection** - Secure access with bcrypt authentication  
  密码保护 - 使用 bcrypt 加密的安全认证

- 🌓 **Dark Mode** - Light and dark theme support  
  深色模式 - 支持明暗主题切换

- 🌍 **Multi-language** - English, 中文, 日本語, 한국어, Français...  
  多语言支持

## Installation | 安装

**Requirements | 环境要求:** Node.js >= 20.19.0

```bash
# Install | 安装
npm install hexo-dashboard --save

# Or using pnpm | 或使用 pnpm
pnpm add hexo-dashboard
```

## Usage | 使用方法

### Start Server | 启动服务器

```bash
hexo server
```

Then visit | 然后访问: `http://localhost:4000/dashboard`

## User Management CLI | 用户管理命令

Manage dashboard users from the command line.  
通过命令行管理面板用户。

### Commands | 命令列表

| Command | Description |
|---------|-------------|
| `register <user> <pass>` | Add a new user 添加新用户 |
| `passwd <user> <pass>` | Change user password 修改用户密码 |
| `delete <user>` | Delete a user 删除用户 |
| `list` | List all users 列出所有用户 |
| `help` | Show help message 显示帮助信息 |

### Command Aliases | 命令别名

| Command | Aliases |
|---------|---------|
| `register` | `reg` |
| `delete` | `del`, `rm`, `remove` |
| `list` | `ls` |

### Examples | 使用示例

```bash
# Show help | 显示帮助
npx hexo-dashboard help

# Register a new user | 注册新用户
npx hexo-dashboard register admin mypassword123

# Change password | 修改密码
npx hexo-dashboard passwd admin newpassword456

# Delete a user | 删除用户
npx hexo-dashboard delete admin

# List all users | 列出所有用户
npx hexo-dashboard list
```

### Configuration | 配置说明

After registration, your `_config.yml` will contain:  
注册后，`_config.yml` 会包含：

```yaml
dashboard:
  admin: $2b$12$ABC...xyz    # bcrypt hashed password
```

## Troubleshooting | 常见问题

### "hexo-dashboard" command not found | 命令未找到

Use `npx` to run the command:  
使用 `npx` 运行命令：

```bash
npx hexo-dashboard register admin password
```

### "_config.yml" not found | 配置文件未找到

Make sure you run the command in your Hexo project directory:  
确保在 Hexo 项目目录中运行命令：

```bash
cd /path/to/your/hexo
npx hexo-dashboard register admin password
```

## Security Notes | 安全提示

- ⚠️ Passwords are hashed with bcrypt (cost factor: 12)  
  密码使用 bcrypt 加密（成本因子：12）

- ⚠️ Never commit plaintext passwords to version control  
  不要将明文密码提交到版本控制

- ⚠️ Keep your `_config.yml` secure  
  妥善保管你的配置文件

## Credits | 致谢

- [hexo-admin](https://github.com/jaredly/hexo-admin)
- [hexo-myadmin](https://github.com/xjpin/hexo-myadmin)