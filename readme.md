# 🔐 Node.js Authentication System

A complete authentication system built with **Node.js, Express, MongoDB, and JWT**, featuring:

- User signup & login
- Email verification with expiry
- Resend verification link
- Password hashing with bcrypt
- JWT authentication

---

## 🚀 Features

- Signup with **first name, last name, email, and password**
- Automatic **full name** generation
- Verification link sent to user's Gmail
- Link expires after 10 minutes, with **resend option**
- Secure login only after email verification
- Error handling with custom messages

---

## 📦 Installation

1.  npm install

2.  Create a config file config.env in the root directory:

    PORT=3000
    NODE_ENV=development
    DATABASE=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
    DATABASE_PASSWORD=<your-db-password>
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=90d
    EMAIL_USERNAME=your_email@gmail.com
    EMAIL_PASSWORD=your_generated_app_password

3.  📧 Gmail Setup (for sending verification emails)

    1. Go to Google Account Security.
    2. Enable 2-Step Verification.
    3. Generate an App Password under App Passwords.
    4. Use your Gmail as EMAIL_USERNAME and the generated 16-character password as EMAIL_PASSWORD.

4.  ▶️ Running the App

    nodemon .\server.js

5.  🛠 API Endpoints

    🔹 Signup
    POST /api/v1/users/signup

    🔹 Verify Email
    GET /api/v1/users/verify/:token

    🔹 Login
    POST /api/v1/users/login

6.  🗂 Folder Structure

    project/
    ├── controllers/
    │ └── authController.js
    ├── models/
    │ └── userModel.js
    ├── utils/
    │ ├── appError.js
    │ └── sendEmail.js
    ├── server.js
    ├── config.env
    └── README.md
