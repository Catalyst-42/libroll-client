# Libroll - client
Клиентска часть приложения для учёта созданных займов книг в библиотеке. Написана на React, для стилей используется Bootstrap. 

### Установка и запуск

Для установки зависимостей выполните команду:

```sh
npm i
```

Для запуска приложения выполните команду:

```sh
npm start
```

В приложении может находится .env файл с конфигурацией URL адреса для api приложения, если URL не задан, то будет использоваться адрес `localhost:5000`:

```.env
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Изображения: 
| ![Main](img/Libroll%20-%20Main.png) | ![Books](img/Libroll%20-%20Books.png) |
|-|-|
| ![Users](img/Libroll%20-%20Users.png) | ![Borrows](img/Libroll%20-%20Borrows.png) |

<!-- TODO:
- [x] Remove all old tasks cuz them was too dumb
- [x] Modal forms for all operation types
- [x] Icons for actions and better frontend UI
- [x] Show message if database is down
- [x] Make normal readme file

- [ ] Final cleanup

- [ ] ? User page with them borrow history
- [ ] ? Books page with them borrow history

- [ ] Think a bit more about database look
- [ ] ? User +middle name?
- [ ] ? External book creators tabe?
- [ ] ? Remove books counter, add a unique id for borrows 
 -->
