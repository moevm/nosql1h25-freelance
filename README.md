# nosql_template

## Отладочные пользователи

В проекте 3 роли:
- Фрилансер - участвует в конкурсах, добавляет или дорабатывает решения
- Заказчик - публикует конкурсы и проверяет решения
- Администратор - управляет платформой, типами конкурсов, проверяет корректность конкурсов и решений


### Фрилансеры 
1. **Аккаунт 1**  
  Логин: freelancer  
  Пароль: freelancer
2. **Аккаунт 2**  
  Логин: finder  
  Пароль: 123456 

#### Данные фрилансеров
```
{
  'id': '6822f88a0d1450eafe512e9f',
  'email': 'freelancer@mail.ru',
  'login': 'freelancer',
  'password': 'freelancer',
  'role': 1,
  'status': 1,
  'createdAt': '2025-05-13T11:35:41.138000'
},
{
  'id': '6823329d287514ab3b0195f8',
  'email': 'finder@mail.ru',
  'login': 'finder',
  'password': '123456',
  'role': 1,
  'status': 1,
  'createdAt': '2025-05-13T11:53:01.004000'
}
```

### Заказчики
1. **Аккаунт 1**  
  Логин: employer  
  Пароль: employer
2. **Аккаунт 2**  
  Логин: enthusiast   
  Пароль: 33333337
3. **Аккаунт 3**  
  Логин: someman   
  Пароль: 123456

#### Данные заказчиков
```
{
  'id': '6822f88a0d1450eafe512ea0',
  'email': 'employer@yandex.ru',
  'login': 'employer',
  'password': 'employer',
  'role': 2,
  'status': 1,
  'createdAt': '2025-05-13T11:35:41.138000'
},
{
  'id': '6823193fd8bb90c43b9795fc',
  'email': 'enthusiast@outlook.com',
  'login': 'enthusiast',
  'password': '33333337',
  'role': 2,
  'status': 1,
  'createdAt': '2025-05-13T10:04:47.756000'
},
{
  'id': '6823151bd8bb90c43b9795f2',
  'email': 'someman@gmail.com',
  'login': 'someman',
  'password': '123456',
  'role': 2,
  'status': 1,
  'createdAt': '2025-05-13T09:47:07.434000'
}
```

### Администратор
Логин: admin  
Пароль: admin


### Данные администратора
```
{
  'id': '6822f88a0d1450eafe512e9e',
  'email': 'admin@rambler.ru',
  'login': 'admin',
  'password': 'admin',
  'role': 3,
  'status': 1,
  'createdAt': '2025-05-13T11:35:41.138000'
}
``` 


## Предварительная проверка заданий

<a href=" ./../../../actions/workflows/1_helloworld.yml" >![1. Согласована и сформулирована тема курсовой]( ./../../actions/workflows/1_helloworld.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/2_usecase.yml" >![2. Usecase]( ./../../actions/workflows/2_usecase.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/3_data_model.yml" >![3. Модель данных]( ./../../actions/workflows/3_data_model.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/4_prototype_store_and_view.yml" >![4. Прототип хранение и представление]( ./../../actions/workflows/4_prototype_store_and_view.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/5_prototype_analysis.yml" >![5. Прототип анализ]( ./../../actions/workflows/5_prototype_analysis.yml/badge.svg)</a> 

<a href=" ./../../../actions/workflows/6_report.yml" >![6. Пояснительная записка]( ./../../actions/workflows/6_report.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/7_app_is_ready.yml" >![7. App is ready]( ./../../actions/workflows/7_app_is_ready.yml/badge.svg)</a>
