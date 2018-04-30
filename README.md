### Запуск версии для разработки:

First you're gonna need to install ssl certificate for localhost.

For MacOS:

1.  Go to `server/cert` and double click `rootCA.pem`. It will add this certificate to Keychain app. Next in the keychain app select this certificate (it's called Storiqa), right click -> Get Info -> Trust -> Always trust. This will enable `https` for Chrome and Safari.

2.  For Firefox go to `about:preferences#privacy`. Scroll down to `View certificates`. Then on authorities click `import` and add `rootCA.pem`.

#### Docker:

`yarn docker`

#### "Вручную"

установите зависимости: `yarn`

`yarn dev` -- бэкенд на stable (используется в большинстве случаев).

`yarn dev:nightly` -- если разработчику нужна свежая бэковая фича с nightly контура.

_https://localhost:3443/_

---

### Продакшн-версия:

#### Запуск

`yarn server:prod`

#### Сборка

`yarn build` (создаст бандл для SPA и стили в папке `build`)

`yarn server:dist:build` (создаст бандл для сервера в папке `dist`)

#### Проверка того, что контейнер соберется на стейдже:

`yarn checkImage`

---

### E2E-тесты

#### `yarn test:e2e`

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

#### Пример работы с автогенерированными Flow-типами для Relay

## `https://github.com/StoriqaTeam/front/pull/137/commits/711d30c0efa56f1c5ecbc7148a55d610ed5ac11a`

#### Отключение pre-push хука

Ключ `--no-verify`

---

#### Переменная для хранения хоста, где будет развернута аппа (в .env файле)

`REACT_APP_HOST=https://localhost:3443`
