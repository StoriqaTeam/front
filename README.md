**Пререквизиты:**

0. запустите бэкенд-сервисы (gateway & users)
1. склонируйте репозиторий
2. перейдите в созданную папку
---

### Запуск версии для разработки:
#### Docker:
`yarn docker`


#### "Вручную"
установите зависимости: `yarn`

`yarn dev`

*http://localhost:3003/*

---
### Продакшн-версия:

`yarn server:prod`

---

#### Авторизация через соцсети в dev-режиме
Содержимое `config/development.toml` для микросервиса `users`:
```
[google]
id = "871193957401-nj13tsffqmo3e4l175ik5rr2vt9ojkuk.apps.googleusercontent.com"
key = "YKzh-kLMl1FPIejxV9d9jiBi"
info_url = "https://www.googleapis.com/userinfo/v2/me"
code_to_token_url= "https://www.googleapis.com/oauth2/v4/token"
redirect_url="http://localhost:3003/oauth_callback/google"

[facebook]
id = "148962589140408"
key = "9926ceb8bd833f602e559a8b93ac299b"
info_url = "https://graph.facebook.com/me"
code_to_token_url= "https://graph.facebook.com/v2.11/oauth/access_token"
redirect_url="http://localhost:3003/oauth_callback/fb"
```
