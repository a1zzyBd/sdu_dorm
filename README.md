# 🏠 SDU Dorm

## 🎯 Technology Stack

### Backend (Django)

* **Django 4.2.25** — web framework
* **Django REST Framework** — for building REST APIs
* **PostgreSQL** — relational database
* **JWT (Simple JWT)** — token-based authentication
* **Argon2** — secure password hashing
* **CORS Headers** — support for cross-origin requests

### Frontend (React)

* **React 18** — UI library
* **TypeScript** — typed JavaScript
* **Vite** — build tool
* **Tailwind CSS** — utility-first CSS framework
* **Lucide React** — icon collection

---

## 📁 Project Structure

```bash
sdudorm-project/
│
├── sdudorm-backend/              # Django Backend
│   ├── manage.py
│   ├── requirements.txt          # Python dependencies
│   ├── seed_data.sql             # Test data
│   ├── .env                      # Environment variables (create manually)
│   │
│   ├── sdudorm_backend/          # Django settings
│   │   ├── settings.py           # Configuration (JWT, CORS, DB)
│   │   ├── urls.py               # Main routes
│   │   └── wsgi.py
│   │
│   ├── students/                 # App: Students
│   │   ├── models.py             # Student model
│   │   ├── views.py              # Login, Profile, Change Password
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   └── explanations/             # App: Explanations and Rooms
│       ├── models.py             # Explanation, Room, RoomAssignment
│       ├── views.py              # CRUD + Approve/Reject + Export
│       ├── serializers.py
│       └── urls.py
│
├── sdudorm-frontend/             # React Frontend
│   ├── public/                   # Static files
│   │   ├── sduLogo.png
│   │   └── sduDor.png
│   │
│   ├── src/
│   │   ├── components/           # React components
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
│   │   │   └── backendAPI.ts     # API client for Django
│   │   │
│   │   ├── App.tsx               # Main component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css
│   │
│   ├── package.json              # Node.js dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── vite.config.ts            # Vite config
│   └── tailwind.config.js        # Tailwind CSS config
│
└── README.md                     # This file
```

## 🚀 Installation and Launch (Complete Guide)

### Prerequisites

Make sure you have installed:

* **Python 3.12+** ([Download](https://www.python.org/downloads/))
* **Node.js 18+** ([Download](https://nodejs.org/))
* **PostgreSQL 15+** ([Download](https://www.postgresql.org/download/))
* **Git** ([Download](https://git-scm.com/))

Check installation:

```bash
python --version    # Python 3.12.x
node --version      # v20.x.x
npm --version       # 10.x.x
psql --version      # psql 15.x
git --version       # git 2.x.x
```

---

## 📦 Step 1: Clone the Repository

```bash
git clone https://github.com/Nurdaulet-no/sdu-dorm.git
cd sdu-dorm
```

### Update the code

First check the branch:

```bash
git checkout nurda
```

Then pull the latest changes:

```bash
git pull origin main
```

---

## 🔧 Step 2: Backend Setup (Django)

### 2.1 Go to the backend folder

```bash
cd sdudorm-backend
```

### 2.2 Create a virtual environment

```bash
# Linux/Mac
python -m venv .venv 
# if python does not work, use python3
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
```

### 2.3 Install dependencies

```bash
pip install -r requirements.txt
```

**requirements.txt contains:**

* Django==4.2.25
* djangorestframework==3.15.2
* djangorestframework-simplejwt==5.4.0
* psycopg2-binary==2.9.10
* django-cors-headers==4.6.0
* argon2-cffi==23.1.0
* python-dotenv==1.0.1

### 2.4 Create the PostgreSQL database

```bash
# Log in to PostgreSQL
psql -U postgres

# Run in the psql console:
CREATE DATABASE sdudorm_db;
CREATE USER postgres1 WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sdudorm_db TO postgres1;
\q
```

### 2.5 Create the .env file

Create a `.env` file in the root folder `sdudorm-backend/`:

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

### 2.6 Apply migrations and load test data

This command creates tables in the database (migrations) and fills them with test data.

```bash
python manage.py update_db
```

This command automatically:

* Applies all required migrations (`makemigrations` and `migrate`)
* Loads all data from the `seed_data.sql` file
* Prints verification information to the console

Test data includes:

* **20 students** from different schools with personal emails
* **1 coordinator** (Status: "Coordinator of B block", Degree: "M2", Room: "B418")
* **University emails**: all `@stu.sdu.edu.kz` (used for login)
* **Personal emails**: `@gmail.com`, `@mail.ru`, `@inbox.ru` (shown in the profile)
* **Password**: `password123` (for all users)
* **30 rooms** (15 in block A for men, 18 in block B for women)
* **12 active room assignments**
* **8 explanation notes**

**Test accounts:**

* Student: `nurzhan.aitanov@stu.sdu.edu.kz` / `password123`
* Coordinator: `coordinator@sdu.edu.kz` / `password123`

### 2.8 Run the Django server

```bash
python manage.py runserver 8000
```

✅ **Backend is running at:** [http://localhost:8000](http://localhost:8000)

---

## ⚛️ Step 3: Frontend Setup (React)

### 3.1 Open a new terminal

Keep the backend server running in the first terminal.

### 3.2 Go to the frontend folder

```bash
cd sdudorm-frontend
```

### 3.3 Install dependencies

```bash
npm install
```

### 3.4 Run the React server

```bash
npm run dev
```

✅ **Frontend is running at:** [http://localhost:5173](http://localhost:5173)

---

## 🎉 Step 4: Open the Application

Open your browser and go to:

```text
http://localhost:5173
```

### Test accounts for login

**Student:**

* Email: `nurzhan.aitanov@stu.sdu.edu.kz`
* Password: `password123`

**Coordinator:**

* Email: `coordinator@sdu.edu.kz`
* Password: `password123`

---

## 🗄️ Database (4 tables)

### 1. `auth_user` — Django users

* Used only for JWT authentication
* Created automatically during login
* Relation: `User.username == Student.email`

### 2. `students` — Students and coordinators

* **student_id** (PK) — for example, `"22B030001"`
* **fullname** — full name
* **email** — primary email (`university_email`)
* **university_email** — university email (`@stu.sdu.edu.kz`) — **used for login**
* **personal_email** — personal email (`@gmail.com`, etc.) — displayed in the profile, but not used for login
* **school** — school name (for example `"№35 zhalpy mektep"`, `"NIS Almaty"`)
* **password_hash** — password hash (Argon2)
* **birthdate, specialty, course** — student data
* **gender** — male / female
* **access** — student / coordinator
* **violation_count** — number of violations
* **Personal data:** iin, iban, doc_type, doc_number, doc_issue_date, local_address
* **Coordinator fields:** status, degree, special_room

### 3. `explanations` — Explanation notes

* **id** (PK)
* **student_id** (FK) → students
* **explanation_text** — explanation note text
* **status** — pending / approved / rejected
* **created_at** — submission date
* **reviewed_at** — review date

**Rule:** only 1 pending explanation per student

### 4. `rooms` — Dorm rooms

* **room_number** (PK) — for example, `"A301"`
* **block** — A / B
* **floor** — floor number
* **max_capacity** — capacity (usually 4)
* **gender** — male / female
* **status** — active / maintenance

**Block A** = men, **Block B** = women

### 5. `room_assignments` — Student room assignments

* **id** (PK)
* **student_id** (FK) → students
* **room_number** (FK) → rooms
* **assigned_at** — assignment date

**Rule:** 1 student = 1 room at a time

---

## 🌐 API Endpoints (16 total)

### Authentication

```text
POST   /api/auth/login/         # Login (email + password)
POST   /api/auth/logout/        # Logout
```

### Profile

```text
GET    /api/profile/                    # Get profile
PUT    /api/profile/                    # Update data
POST   /api/profile/change-password/    # Change password
```

### Explanations (students)

```text
GET    /api/explanations/my/    # My explanations
POST   /api/explanations/       # Submit an explanation
```

### Explanations (coordinators)

```text
GET    /api/explanations/pending/      # Waiting for review
GET    /api/explanations/reviewed/     # Reviewed
PATCH  /api/explanations/:id/approve/  # Approve (+1 violation)
PATCH  /api/explanations/:id/reject/   # Reject
```

### Rooms

```text
GET    /api/rooms/?block=A                    # List rooms by block
GET    /api/rooms/:room_number/residents/     # Who lives in the room
POST   /api/room-assignments/                 # Assign a student to a room
DELETE /api/room-assignments/                 # Remove a student from a room
GET    /api/students/unassigned/?gender=male  # Students without a room
```

### Reports

```text
POST   /api/reports/violations/export/   # Download CSV report
```

---

## ✨ Main Features

### For students:

1. **System login** → JWT authentication
2. **Home page** → profile, room, and violation information
3. **My profile** → edit personal data (IIN, IBAN, documents)
4. **News** → view dormitory news
5. **Online services** → submit explanation notes
6. **Report export** → CSV file with violations by blocks and dates
7. **Room tracking** → view room occupancy
8. **Settings** → change password, choose language

### For coordinators:

1. **Review explanation notes** → approve/reject (with violation counter increase)
2. **Room management** → assign/remove students
3. **Gender filtering** → Block A (men), Block B (women)
4. **Monitoring** → view live room occupancy

---

## 🔐 Security

* **Argon2** — modern password hashing (top priority)
* **JWT tokens** — Access (1 hour) + Refresh (7 days)
* **CORS protection** — only `localhost:5173` is allowed
* **Permission checks** — access rights are checked for every endpoint
* **Django ORM** — protection against SQL injection
* **Auto-logout** — automatic logout when the token expires
* **Environment variables** — secret data stored in `.env`

---

## 🛠️ Development Commands

### Backend (Django)

```bash
# Run the server
python manage.py runserver 8000

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run shell
python manage.py shell
```

### Frontend (React)

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# TypeScript type check
npm run type-check

# Format code
npm run format
```

---
## Student IDs

- 230107088
- 230103071
- 230103129
- 230109015

