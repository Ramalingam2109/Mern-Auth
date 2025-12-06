# 🔐 MERN Authentication System

A robust, production-ready Authentication System built with the MERN stack (MongoDB, Express, React, Node.js). Features a modern UI, secure JWT authentication, and email verification.

![Home Page Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 👤 User Authentication
- **Secure Registration**: Password hashing with bcrypt.
- **Login/Logout**: JWT (JSON Web Token) based session management via HTTP-only cookies.
- **Email Verification**: OTP-based email verification using Nodemailer.
- **Password Reset**: Secure forgot/reset password flow with expirations.

### 💻 Frontend (Client)
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS for a modern, responsive design.
- **State Management**: Context API for centralized auth state.
- **Validation**: Zod schema validation with React Hook Form.
- **UX**: Toast notifications, loading states, and smooth transitions.

### 🛠️ Backend (Server)
- **Runtime**: Node.js & Express
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Security**: CORS, Helmet (recommended), and HTTP-only cookies.
- **Email**: SMTP integration (Brevo/Sendinblue compatible).

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- pnpm (Recommended) or npm
- MongoDB Atlas Account

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mern-auth.git
cd mern-auth
```

### 2. Install Dependencies
We use a **Monorepo** structure. Install dependencies for both client and server.

**Client:**
```bash
cd client
pnpm install
```

**Server:**
```bash
cd ../server
pnpm install
```

### 3. Environment Setup
Create `.env` files in both `client` and `server` directories.

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_MAIL=your_sender_email
FRONTEND_URL=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_BACKEND_URL=http://localhost:5000/
```

### 4. Run Locally
Run both servers in separate terminals:

**Terminal 1 (Backend):**
```bash
cd server
pnpm run server
```

**Terminal 2 (Frontend):**
```bash
cd client
pnpm run dev
```

Visit `http://localhost:5173` to view the app!

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/send-verify-otp` | Send verification email |
| POST | `/api/auth/verify-account` | Verify account with OTP |
| POST | `/api/auth/send-reset-otp` | Send password reset OTP |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/user/data` | Get user profile |

---

## 📦 Deployment

This project is set up for **Monorepo Deployment**.

- **Frontend**: Deploy `client` folder to **Vercel**.
- **Backend**: Deploy `server` folder to **Render**.

👉 **[Read the Full Deployment Guide](./deployment_guide.md)**

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Bult with ❤️ by [Your Name]
