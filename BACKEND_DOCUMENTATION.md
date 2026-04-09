
---

```markdown
# 🔧 SDU Dorm Backend — Документация для Django

## 🎯 Технологии
- **Django 4.2.25** — основной фреймворк  
- **PostgreSQL** — база данных  
- **JWT токены** — авторизация  
- **Argon2** — шифрование паролей  
- **CORS** — связь с фронтендом

---

## 🗄️ База данных (4 таблицы)

### 1. `students` — студенты
| Поле | Тип | Описание |
|------|-----|-----------|
| student_id | string | (например, 210103001) |
| fullname | string | Полное имя |
| email | string | Email |
| password_hash | string | Хэш пароля (Argon2) |
| birthdate | date | Дата рождения |
| specialty | string | Специальность |
| course | int | Курс |
| gender | string | male / female |
| access | string | student / coordinator |
| violation_count | int | Кол-во нарушений |
| iin | string | ИИН |
| iban | string | IBAN |
| doc_type | string | Тип документа |
| doc_number | string | Номер документа |
| doc_issue_date | date | Дата выдачи |
| local_address | string | Адрес проживания |

---

### 2. `explanations` — объяснительные
| Поле | Тип | Описание |
|------|-----|-----------|
| id | int | ID записи |
| student_id | FK | Ссылка на студента |
| explanation_text | text | Текст объяснительной |
| status | string | pending / approved / rejected |
| created_at | datetime | Когда подана |
| reviewed_at | datetime | Когда проверена |

> **Правило:** только 1 `pending` на студента одновременно

---

### 3. `rooms` — комнаты
| Поле | Тип | Описание |
|------|-----|-----------|
| room_number | string | Например: A301 |
| block | string | A / B |
| floor | int | Этаж |
| max_capacity | int | Вместимость |
| gender | string | male / female |
| status | string | active / maintenance |

> **Блок A** = мужчины  
> **Блок B** = женщины

---

### 4. `room_assignments` — заселение
| Поле | Тип | Описание |
|------|-----|-----------|
| id | int | ID |
| student_id | FK | Ссылка на студента |
| room_number | FK | Ссылка на комнату |
| assigned_at | datetime | Дата заселения |

> **Правило:** студент только в 1 комнате одновременно

---

## 🌐 API Endpoints (16 штук)

### Авторизация
```

POST /api/auth/login/           # Вход (email + password)
POST /api/auth/logout/          # Выход

```

### Объяснительные (студенты)
```

GET  /api/explanations/my/      # Мои объяснительные
POST /api/explanations/         # Подать объяснительную

```

### Объяснительные (координаторы)
```

GET   /api/explanations/pending/       # Ожидающие проверки
GET   /api/explanations/reviewed/      # Проверенные
PATCH /api/explanations/:id/approve/   # Одобрить (+1 нарушение)
PATCH /api/explanations/:id/reject/    # Отклонить

```

### Комнаты
```

GET    /api/rooms/?block=A                     # Список комнат
GET    /api/rooms/:room_number/residents/      # Кто живет
POST   /api/room-assignments/                  # Заселить
DELETE /api/room-assignments/                  # Выселить
GET    /api/students/unassigned/?gender=male   # Без комнаты

```

### Профиль
```

GET  /api/profile/                   # Получить профиль
PUT  /api/profile/                   # Обновить данные
POST /api/profile/change-password/   # Сменить пароль

```

### Отчеты
```

POST /api/reports/violations/export/   # Скачать CSV отчет
Body: { block: "A", date_from: "2024-01-01", date_to: "2024-12-31" }

````

---

## 🚀 Как запустить (5 шагов)

### Шаг 1: Установить зависимости
```bash
cd sdudorm-backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

pip install -r requirements.txt
````

**requirements.txt**

```
Django==4.2.25
djangorestframework==3.15.2
djangorestframework-simplejwt==5.4.0
psycopg2-binary==2.9.10
django-cors-headers==4.6.0
argon2-cffi==23.1.0
python-dotenv==1.0.1
```

---

### Шаг 2: Создать базу данных

```sql
# Войти в PostgreSQL
psql -U postgres

# Создать базу и пользователя
CREATE DATABASE sdudorm_db;
CREATE USER postgres1 WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sdudorm_db TO postgres1;
\q
```

---

### Шаг 3: Настроить .env файл

Создать файл `.env` в корне проекта:

```env
DB_NAME=sdudorm_db
DB_USER=postgres1
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=ваш-секретный-ключ
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

### Шаг 4: Запустить миграции
Это команда создает таблицы в базе данных (миграции) и заполняет их тестовыми данными.

```bash
python manage.py update_db
```
Эта команда автоматически:
Применит все необходимые миграции (makemigrations и migrate).
Загрузит все данные из файла seed_data.sql.
Выведет в консоль информацию для проверки.

### Шаг 5: Запустить сервер

```bash
python manage.py runserver 8000
```

✅ Сервер работает на [http://localhost:8000](http://localhost:8000)

---

## 🧪 Тестовые данные

Тестовые данные находятся в файле `seed_data.sql` и загружаются командой `update_db` в Шаге 4.

Содержимое `seed_data.sql`:

* 20 студентов (ID: `210103001–210103020`)
* 1 координатор (`COORD001`)
* Email: `nurzhan.aitanov@stu.sdu.edu.kz`
* Пароль: `password123` (для всех)
* 30 комнат (A301–A315, B301–B315)
* 12 заселений
* 15 объяснительных

---

## 🔐 Безопасность

* **Argon2** — современное шифрование паролей
* **JWT токены** — `access` (1 час) + `refresh` (7 дней)
* **CORS защита** — только `localhost:5173`
* **Permission checks** — проверка прав доступа
* **Django ORM** — защита от SQL-инъекций

---

## 🔧 Структура проекта

```
sdudorm-backend/
├── manage.py
├── requirements.txt
├── .env
├── seed_data.sql
├── sdudorm_backend/        # Настройки Django
│   ├── settings.py         # JWT + Argon2 + CORS
│   └── urls.py
├── students/               # Студенты и авторизация
│   ├── models.py           # Student модель
│   ├── views.py            # Login, Profile
│   └── urls.py
└── explanations/           # Объяснительные и комнаты
    ├── models.py           # Explanation, Room, RoomAssignment
    ├── views.py            # CRUD + Export
    └── urls.py
```

---

## ❗ Важные моменты

* Не используйте поле `room` в `Student` — связь через `room_assignments`
* Один студент = одна `pending` объяснительная
* **Блок A = мужчины**, **Блок B = женщины** — проверяется в коде
* JWT токен обновляется автоматически (`access` 1ч, `refresh` 7д)
* **Argon2** — первый приоритет в `PASSWORD_HASHERS`

---