# 🏠 SDU Dorm

## 🎯 Технологический стек

### Backend (Django)
- **Django 4.2.25** — веб-фреймворк
- **Django REST Framework** — создание REST API
- **PostgreSQL** — реляционная база данных
- **JWT (Simple JWT)** — аутентификация через токены
- **Argon2** — безопасное хеширование паролей
- **CORS Headers** — поддержка кросс-доменных запросов

### Frontend (React)
- **React 18** — библиотека для UI
- **TypeScript** — типизированный JavaScript
- **Vite** — инструмент сборки
- **Tailwind CSS** — utility-first CSS фреймворк
- **Lucide React** — коллекция иконок

---


## 📁 Структура проекта

```
sdudorm-project/
│
├── sdudorm-backend/              # Django Backend
│   ├── manage.py
│   ├── requirements.txt          # Python зависимости
│   ├── seed_data.sql             # Тестовые данные
│   ├── .env                      # Переменные окружения (создать вручную)
│   │
│   ├── sdudorm_backend/          # Настройки Django
│   │   ├── settings.py           # Конфигурация (JWT, CORS, БД)
│   │   ├── urls.py               # Главные маршруты
│   │   └── wsgi.py
│   │
│   ├── students/                 # Приложение: Студенты
│   │   ├── models.py             # Модель Student
│   │   ├── views.py              # Login, Profile, Change Password
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   └── explanations/             # Приложение: Объяснительные и Комнаты
│       ├── models.py             # Explanation, Room, RoomAssignment
│       ├── views.py              # CRUD + Approve/Reject + Export
│       ├── serializers.py
│       └── urls.py
│
├── sdudorm-frontend/             # React Frontend
│   ├── public/                   # Статические файлы
│   │   ├── sduLogo.png
│   │   └── sduDor.png
│   │
│   ├── src/
│   │   ├── components/           # React компоненты
│   │   │   ├── LoginPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── MyProfilePage.tsx
│   │   │   ├── NewsPage.tsx
│   │   │   ├── OnlineServicesPage.tsx
│   │   │   ├── RoomTrackingPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── ...
│   │   │
│   │   ├── api/
│   │   │   └── backendAPI.ts     # API клиент для Django
│   │   │
│   │   ├── App.tsx               # Главный компонент
│   │   ├── main.tsx              # Точка входа
│   │   └── index.css
│   │
│   ├── package.json              # Node.js зависимости
│   ├── tsconfig.json             # TypeScript конфиг
│   ├── vite.config.ts            # Vite конфиг
│   └── tailwind.config.js        # Tailwind CSS конфиг
│
└── README.md                     # Этот файл
```

## 🚀 Установка и запуск (Полное руководство)

### Предварительные требования

Убедитесь, что у вас установлены:

- **Python 3.12+** ([Скачать](https://www.python.org/downloads/))
- **Node.js 18+** ([Скачать](https://nodejs.org/))
- **PostgreSQL 15+** ([Скачать](https://www.postgresql.org/download/))
- **Git** ([Скачать](https://git-scm.com/))

Проверка установки:

```bash
python --version    # Python 3.12.x
node --version      # v20.x.x
npm --version       # 10.x.x
psql --version      # psql 15.x
git --version       # git 2.x.x
```

---

## 📦 Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/Nurdaulet-no/sdu-dorm.git
cd sdu-dorm
```
### Обновление кода

First check bransh
```bash 
git checkout nurda
```

Then pull the latest changes
```bash
git pull origin main
```

---

## 🔧 Шаг 2: Настройка Backend (Django)

### 2.1 Перейти в папку backend

```bash
cd sdudorm-backend
```

### 2.2 Создать виртуальное окружение

```bash
# Linux/Mac
python -m venv .venv 
# if python dont work use python3
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
```

### 2.3 Установить зависимости

```bash
pip install -r requirements.txt
```

**requirements.txt содержит:**
- Django==4.2.25
- djangorestframework==3.15.2
- djangorestframework-simplejwt==5.4.0
- psycopg2-binary==2.9.10
- django-cors-headers==4.6.0
- argon2-cffi==23.1.0
- python-dotenv==1.0.1

### 2.4 Создать базу данных PostgreSQL

```bash
# Войти в PostgreSQL
psql -U postgres

# В psql консоли выполнить:
CREATE DATABASE sdudorm_db;
CREATE USER postgres1 WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sdudorm_db TO postgres1;
\q
```

### 2.5 Создать .env файл

Создайте файл `.env` в корневой папке `sdudorm-backend/`:

```env
DB_NAME=sdudorm_db
DB_USER=postgres1
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key-here-change-me
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 2.6 Применить миграции и загрузить тестовые данные

Это команда создает таблицы в базе данных (миграции) и заполняет их тестовыми данными.

```bash
python manage.py update_db
```
Эта команда автоматически:
Применит все необходимые миграции (makemigrations и migrate).
Загрузит все данные из файла seed_data.sql.
Выведет в консоль информацию для проверки.


Тестовые данные включают:
- **20 студентов** с разными школами и личными emails
- **1 координатор** (Status: "Coordinator of B block", Degree: "M2", Room: "B418")
- **University emails**: все @stu.sdu.edu.kz (используются для логина)
- **Personal emails**: @gmail.com, @mail.ru, @inbox.ru (отображаются в профиле)
- **Пароль**: `password123` (для всех)
- **30 комнат** (15 в блоке A для мужчин, 18 в блоке B для женщин)
- **12 активных заселений**
- **8 объяснительных записок**

**Тестовые аккаунты:**
- Студент: `nurzhan.aitanov@stu.sdu.edu.kz` / `password123`
- Координатор: `coordinator@sdu.edu.kz` / `password123`

### 2.8 Запустить Django сервер

```bash
python manage.py runserver 8000
```

✅ **Backend запущен:** http://localhost:8000

---

## ⚛️ Шаг 3: Настройка Frontend (React)

### 3.1 Открыть новый терминал

Оставьте backend сервер работать в первом терминале.

### 3.2 Перейти в папку frontend

```bash
cd sdudorm-frontend
```

### 3.3 Установить зависимости

```bash
npm install
```

### 3.4 Запустить React сервер

```bash
npm run dev
```

✅ **Frontend запущен:** http://localhost:5173

---

## 🎉 Шаг 4: Открыть приложение

Откройте браузер и перейдите по адресу:

```
http://localhost:5173
```

### Тестовые аккаунты для входа:

**Студент:**
- Email: `nurzhan.aitanov@stu.sdu.edu.kz`
- Пароль: `password123`

**Координатор:**
- Email: `coordinator@sdu.edu.kz`
- Пароль: `password123`

---

## 🗄️ База данных (4 таблицы)

### 1. `auth_user` — Django пользователи
- Используется только для JWT аутентификации
- Создается автоматически при логине
- Связь: `User.username == Student.email`

### 2. `students` — Студенты и координаторы
- **student_id** (PK) — например, "22B030001"
- **fullname** — полное имя
- **email** — основной email (university_email)
- **university_email** — университетский email (@stu.sdu.edu.kz) - **используется для логина**
- **personal_email** — личный email (@gmail.com и т.д.) - отображается, но не для логина
- **school** — название школы (например "№35 zhalpy mektep", "NIS Almaty")
- **password_hash** — хеш пароля (Argon2)
- **birthdate, specialty, course** — данные студента
- **gender** — male / female
- **access** — student / coordinator
- **violation_count** — количество нарушений
- **Личные данные:** iin, iban, doc_type, doc_number, doc_issue_date, local_address
- **Coordinator поля:** status, degree, special_room

### 3. `explanations` — Объяснительные записки
- **id** (PK)
- **student_id** (FK) → students
- **explanation_text** — текст объяснительной
- **status** — pending / approved / rejected
- **created_at** — дата подачи
- **reviewed_at** — дата проверки

**Правило:** только 1 pending объяснительная на студента

### 4. `rooms` — Комнаты общежития
- **room_number** (PK) — например, "A301"
- **block** — A / B
- **floor** — этаж
- **max_capacity** — вместимость (обычно 4)
- **gender** — male / female
- **status** — active / maintenance

**Блок A** = мужчины, **Блок B** = женщины

### 5. `room_assignments` — Заселение студентов
- **id** (PK)
- **student_id** (FK) → students
- **room_number** (FK) → rooms
- **assigned_at** — дата заселения

**Правило:** 1 студент = 1 комната одновременно

---

## 🌐 API Endpoints (16 штук)

### Авторизация
```
POST   /api/auth/login/         # Вход (email + password)
POST   /api/auth/logout/        # Выход
```

### Профиль
```
GET    /api/profile/            # Получить профиль
PUT    /api/profile/            # Обновить данные
POST   /api/profile/change-password/   # Сменить пароль
```

### Объяснительные (студенты)
```
GET    /api/explanations/my/    # Мои объяснительные
POST   /api/explanations/       # Подать объяснительную
```

### Объяснительные (координаторы)
```
GET    /api/explanations/pending/      # Ожидающие проверки
GET    /api/explanations/reviewed/     # Проверенные
PATCH  /api/explanations/:id/approve/  # Одобрить (+1 нарушение)
PATCH  /api/explanations/:id/reject/   # Отклонить
```

### Комнаты
```
GET    /api/rooms/?block=A                    # Список комнат по блоку
GET    /api/rooms/:room_number/residents/     # Кто живет в комнате
POST   /api/room-assignments/                 # Заселить студента
DELETE /api/room-assignments/                 # Выселить студента
GET    /api/students/unassigned/?gender=male  # Студенты без комнаты
```

### Отчеты
```
POST   /api/reports/violations/export/   # Скачать CSV отчет
```

---

## ✨ Основные функции

### Для студентов:
1. **Вход в систему** → JWT аутентификация
2. **Главная страница** → Информация о профиле, комнате, нарушениях
3. **Мой профиль** → Редактирование личных данных (IIN, IBAN, документы)
4. **Новости** → Просмотр новостей общежития
5. **Онлайн-сервисы** → Подача объяснительных записок
6. **Экспорт отчетов** → CSV файл с нарушениями по блокам и датам
7. **Отслеживание комнат** → Просмотр занятости комнат
8. **Настройки** → Смена пароля, выбор языка

### Для координаторов:
1. **Проверка объяснительных** → Одобрение/отклонение (с увеличением счетчика нарушений)
2. **Управление комнатами** → Заселение/выселение студентов
3. **Фильтрация по полу** → Блок A (мужчины), Блок B (женщины)
4. **Мониторинг** → Просмотр занятости комнат в реальном времени

---

## 🔐 Безопасность

- **Argon2** — современное хеширование паролей (первый приоритет)
- **JWT токены** — Access (1 час) + Refresh (7 дней)
- **CORS защита** — только `localhost:5173` разрешен
- **Permission checks** — проверка прав доступа на каждый endpoint
- **Django ORM** — защита от SQL-инъекций
- **Auto-logout** — автоматический выход при истечении токена
- **Environment variables** — секретные данные в `.env`

---

## 🛠️ Команды для разработки

### Backend (Django)
```bash
# Запуск сервера
python manage.py runserver 8000

# Создание миграций
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск shell
python manage.py shell
```

### Frontend (React)
```bash
# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview

# Проверка типов TypeScript
npm run type-check

# Форматирование кода
npm run format
```

---

## 📚 Дополнительная документация
- **sdudorm-backend/BACKEND_DOCUMENTATION.md** — подробная документация backend
