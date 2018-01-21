**Пререквизиты:**

0. запустите бэкенд-сервисы (gateway & users)
1. склонируйте репозиторий
2. перейдите в созданную папку
---

### Запуск версии для разработки:
#### Docker:
Переименуйте `.env.docker` в `.env.development`

`cd docker && docker-compose up`


#### "Вручную"
установите зависимости: `yarn`

`yarn server:dev`

*http://localhost:3003/*

---
### Продакшн-версия:

`yarn server:prod`

---