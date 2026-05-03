# 🏠 SDU Dorm

> Full-stack dormitory management system for SDU University

---

# 📚 Capstone Project Information

## 🎯 Topic Area

**Education Technology (EdTech)**  
Dormitory Management & Student Accommodation System

---

## ❗ Problem Statement

Managing dormitories manually creates delays, paperwork, and communication problems between students and coordinators. Students struggle with submitting explanations, tracking room assignments, and updating personal information. Coordinators also face difficulties monitoring occupancy, managing violations, and handling room allocations efficiently.

---

## 💡 Proposed Solution

SDU Dorm is a web-based platform designed to digitalize dormitory management at SDU University. The system automates room management, explanation submissions, occupancy tracking, and violation monitoring through a secure and user-friendly interface.

---

## 👥 Target Users

- Students
- Dormitory Coordinators
- University Administration

---

# 🎯 Technology Stack

## ⚙️ Backend (Django)

- **Django 4.2.25** — web framework
- **Django REST Framework** — REST API development
- **PostgreSQL** — relational database
- **JWT (Simple JWT)** — token-based authentication
- **Argon2** — secure password hashing
- **CORS Headers** — support for cross-origin requests

---

## 🎨 Frontend (React)

- **React 18** — UI library
- **TypeScript** — typed JavaScript
- **Vite** — build tool
- **Tailwind CSS** — utility-first CSS framework
- **Lucide React** — icon collection

---

# ✨ Key Features

## 👨‍🎓 Student Features

- Secure login & authentication
- Personal profile management
- Room tracking system
- Explanation note submission
- Violation monitoring
- Password management
- News & announcements page

---

## 👩‍💼 Coordinator Features

- Review and approve/reject explanations
- Room assignment management
- Occupancy monitoring
- CSV report exporting
- Gender-based room filtering

---

# 🔐 Security Features

- JWT Authentication
- Argon2 Password Hashing
- Role-Based Access Control
- Protected API Endpoints
- SQL Injection Protection via Django ORM
- Environment Variable Configuration

---

# 🌐 REST API Architecture

The system follows a REST API architecture using **Django REST Framework**.

### Main API Modules

- Authentication APIs
- Student Profile APIs
- Explanation Management APIs
- Room Management APIs
- Report Export APIs

---

# 📁 Project Structure

```bash
sdudorm-project/
│
├── sdudorm-backend/              # Django Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── seed_data.sql
│   ├── .env
│   │
│   ├── sdudorm_backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── students/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   └── explanations/
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── urls.py
│
├── sdudorm-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
# 🚀 Expected Outcome

At the end of the capstone project, the team will deliver:

Fully functional full-stack web application
Integrated frontend and backend
PostgreSQL database support
REST API services
Responsive user interface
Deployment-ready architecture

# 👨‍💻 Team Members

230107088(Bagdel Aizhan) -Frontend
230103129(Artykbaeva Kamilla)-ui/ux designer
230109015(Sherekhan Marzhan) - backend
230103071(Nurlankyzy Nurailym) - PM/QA tester

# 🔗 Git Repository
https://github.com/a1zzyBd/sdu_dorm
