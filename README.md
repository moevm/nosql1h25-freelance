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


## Предварительная проверка заданий

<a href=" ./../../../actions/workflows/1_helloworld.yml" >![1. Согласована и сформулирована тема курсовой]( ./../../actions/workflows/1_helloworld.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/2_usecase.yml" >![2. Usecase]( ./../../actions/workflows/2_usecase.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/3_data_model.yml" >![3. Модель данных]( ./../../actions/workflows/3_data_model.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/4_prototype_store_and_view.yml" >![4. Прототип хранение и представление]( ./../../actions/workflows/4_prototype_store_and_view.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/5_prototype_analysis.yml" >![5. Прототип анализ]( ./../../actions/workflows/5_prototype_analysis.yml/badge.svg)</a> 

<a href=" ./../../../actions/workflows/6_report.yml" >![6. Пояснительная записка]( ./../../actions/workflows/6_report.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/7_app_is_ready.yml" >![7. App is ready]( ./../../actions/workflows/7_app_is_ready.yml/badge.svg)</a>
