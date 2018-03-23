**Пререквизиты:**

0. запустите бэкенд-сервисы (gateway & users) или с kubernetes (https://github.com/StoriqaTeam/backend/blob/master/setup_k8s.md).
1. склонируйте репозиторий
2. перейдите в созданную папку
---

### Запуск версии для разработки:
#### Docker:
`yarn docker`


#### "Вручную"
установите зависимости: `yarn`

`yarn dev` -- если запускается бэк руками.

`yarn dev:kube` -- если бэк запускается с kubernetes.

*http://localhost:3003/*

---
### Продакшн-версия:

`yarn server:prod`

---

#### Авторизация через соцсети в dev-режиме
Содержимое `config/development.toml` для микросервиса `users`:
```
[jwt]
secret_key = "jwt secret key"

[google]
info_url = "https://www.googleapis.com/userinfo/v2/me"

[facebook]
info_url = "https://graph.facebook.com/me"
```

---

#### Отключение pre-push хука
Ключ `--no-verify`
