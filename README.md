# nosql_template

## Отладочные пользователи

В проекте 3 роли:
- Фрилансер - участвует в конкурсах, добавляет или дорабатывает решения
- Заказчик - публикует конкурсы и проверяет решения
- Администратор - управляет платформой, типами конкурсов, проверяет корректность конкурсов и решений


### Фрилансер
Логин: freelancer  
Пароль: freelancer

### Заказчик
Логин: employer  
Пароль: employer

### Администратор
Логин: admin  
Пароль: admin

### Данные фрилансера
```
{
  'email': 'freelancer@mail.ru',
  'login': 'freelancer',
  'password': 'freelancer',
  'role': 1,
  'status': 1,
}
```

### Данные заказчика
```
{
  'email': 'employer@yandex.ru',
  'login': 'employer',
  'password': 'employer',
  'role': 2,
  'status': 1,
}
```

### Данные администратора
```
{
  'email': 'admin@rambler.ru',
  'login': 'admin',
  'password': 'admin',
  'role': 3,
  'status': 1,
}
```