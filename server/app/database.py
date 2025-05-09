import os
from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "freelance_db")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
contests_collection = db["contests"]
solutions_collection = db["solutions"]
contest_types_collection = db["contest_types"]

def initialize_data():
    if contest_types_collection.count_documents({}) == 0 and \
        users_collection.count_documents({}) == 0 and \
        solutions_collection.count_documents({}) == 0 and \
        contests_collection.count_documents({}) == 0:
    
        contest_types_collection.insert_many([
            {'name': 'Программирование'},
            {'name': 'Дизайн'},
            {'name': 'Искусственный интеллект'},
        ])
    
        users_collection.insert_many([
            {
                'email': 'admin@rambler.ru',
                'login': 'admin',
                'password': 'admin',
                'role': 3,
                'status': 1,
            },
            {
                'email': 'freelancer@mail.ru',
                'login': 'freelancer',
                'password': 'freelancer',
                'role': 1,
                'status': 1,
            },
            {
                'email': 'employer@yandex.ru',
                'login': 'employer',
                'password': 'employer',
                'role': 2,
                'status': 1,
            },
        ])
    
        employer = users_collection.find_one({'login': 'employer'})
        type_prog = contest_types_collection.find_one({'name': 'Программирование'})
        type_design = contest_types_collection.find_one({'name': 'Дизайн'})

        contests_collection.insert_many([
            {
                'employerId': str(employer['_id']),
                'number': 1,
                'title': 'CodeMasters 2025',
                'annotation': 'Международное онлайн-соревнование для разработчиков',
                'description': ('Пришло время доказать, что вы — не просто разработчик, а архитектор цифрового будущего. CodeMasters 2025 — это не соревнование, а экосистема вызовов, где вам предстоит:\n'
                '- 🔥 Сломать шаблоны: От реверс-инжиниринга квантового алгоритма до создания нейросети, которая пишет код лучше вас.\n'
                '- 🌍 Спасти виртуальный мир: Восстановите кибергород после атаки хакеров-революционеров в симуляторе с элементами AR.\n'
                '- ⚡ Прожить 72 часа хакатона в режиме non-stop: Ваш код будет тестироваться роботами, а ошибки подсвечиваться на гигантском экране стадиона.\n\n'
                '### Особенности конкурса:\n'
                '- Трехуровневая система отбора\n'
                '- Призовой фонд 2.5 млн рублей\n'
                '- Поддержка 4 языков программирования\n'
                '- Финал с живым выступлением\n'
                '- Автоматический трекинг через GitHub\n'
                '- Ограничение на использование AI'),
                'endBy': '2025-05-03T23:59:59.999Z',
                'type': str(type_prog['_id']),
                'status': 1,
                'prizepool': 2500000,
                'files': [],
                'winnerId': None
            },
            {
                'employerId': str(employer['_id']),
                'number': 2,
                'title': 'Pixel Wars 2024: Битва визуальных вселенных',
                'annotation': 'Международный конкурс цифрового искусства и дизайна',
                'description': (
                    "Создайте дизайн, который переопределит визуальные стандарты! Участвуйте в номинациях:\n\n"
                    "- 🎨 Лучший логотип для нейросети-художника\n"
                    "- 🖌️ Айдентика для космического стартапа\n"
                    "- 📱 UX/UI для приложения будущего\n\n"
                    "**Фишки конкурса:**\n"
                    "- Работы будут оценивать 10 млн подписчиков арт-сообщества\n"
                    "- Победитель получит персональную выставку в цифровой галерее Metaverse\n"
                    "- Лучшие работы станут NFT-коллекцией\n\n"
                    "**Требования:**\n"
                    "- Соответствие тематике «Технологии + Искусство»\n"
                    "- Максимальный размер файла: 100MB\n"
                    "- Форматы: PNG, SVG, AI"
                ),
                'endBy': '2025-05-09T23:59:59.999Z',
                'type': str(type_design['_id']),
                'status': 1,
                'prizepool': 1500000,
                'files': [],
                'winnerId': None,
            },
        ])


        contest = contests_collection.find_one({'number': 2})
        freelancer = users_collection.find_one({'login': 'freelancer'})
        
        solutions_collection.insert_many([
            {
                'contestId': str(contest['_id']),
                'freelancerId': str(freelancer['_id']),
                'number': 1,
                'title': 'Решение 1',
                'annotation': 'Лучшая иконка для нейросети-художника',
                'description': (' #Лучшая иконка для нейросети-художника\n\n'
                    'Три иконки на выбор:\n'
                    '- 🚶\n'
                    '- 🚶🏽\n'
                    '- 🚶🏿'
                ),
                'files': [],
                'status': 4,
                'createdAt': '2025-04-19T20:53:43.300Z',
                'updatedAt': '2025-04-19T20:53:43.300Z',
                'reviews': [
                    {
                        'number': 1,
                        'score': 3.0,
                        'commentary': 'Представленные иконки слишком однообразные и неподходящие',
                        'createdAt': '2025-04-20T12:50:40.989Z',
                    }
                ]
            }
        ])
        

initialize_data()