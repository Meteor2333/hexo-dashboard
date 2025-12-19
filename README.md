# hexo-admin-plus

A hexo dashboard plugin, for live hexo server.

## USAGE

Node.js >= 12.0.0 required.

```bash
# install hexo-admin-plus
npm i hexo-admin-plus --save

# start server with global hexo-cli
hexo server

# or with pm2 as deamon
pm2 start node_modules/.bin/hexo -- server

# visit localhost:4000/admin

```


## Password Protection

you can add a few config variables to your hexo `_config.yml`:

```
admin:
  username: myfavoritename
  password_hash: be121740bf988b2225a313fa1f107ca1
  secret: a secret something
```

The `password_hash` is the bcrypt hash of your password. You can use [this
site](https://www.bcrypt-generator.com/) to come up with that, or whatever you
want. The `secret` is used to make the cookies secure, so it's a good idea to
have it be long and complicated.

## Thanks

[hexo-admin](https://github.com/jaredly/hexo-admin)
[hexo-myadmin](https://github.com/xjpin/hexo-myadmin)

### Contribute
- let me know how it can be improved in the [github issues](https://github.com/Meteor2333/hexo-admin-plus/issues)
- [fork](https://github.com/Meteor2333/hexo-admin-plus) and pull-request
