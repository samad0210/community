# 🌐 Community Platform — MERN Stack

A full-stack community platform with posts, comments, and role-based admin moderation.

## 🚀 Features

- ✅ **User Authentication** — Register/Login with JWT
- ✅ **Create Posts** — Authenticated users can publish posts
- ✅ **Public Comments** — Any logged-in user can comment
- ✅ **Admin Official Reply** — Admins can post visually distinct official responses
- ✅ **Role-Based Access** — `user` and `admin` roles enforced on backend
- ✅ **Pagination** — Backend pagination for posts
- ✅ **Responsive UI** — Tailwind CSS

## 🗂️ Project Structure

```
community-platform/
├── backend/           # Node.js + Express + MongoDB
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── server.js
└── frontend/          # React + Vite + Tailwind
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        ├── App.jsx
        └── api.js
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

---

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

The API will run on `http://localhost:5000`

**Environment Variables (`.env`):**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/communityDB
JWT_SECRET=your_secret_key_here
```

---

### 2. Seed Demo Users (optional)

```bash
cd backend
node src/seed.js
```

This creates:
- **Admin**: `admin@demo.com` / `admin123`
- **User**: `user@demo.com` / `demo123`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app will run on `http://localhost:3000`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Get current user |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/posts | ❌ | Get all posts (paginated) |
| GET | /api/posts/:id | ❌ | Get single post |
| POST | /api/posts | ✅ User | Create post |
| DELETE | /api/posts/:id | ✅ Owner/Admin | Delete post |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/comments/:postId | ❌ | Get comments for post |
| POST | /api/comments/:postId | ✅ User | Add regular comment |
| POST | /api/comments/:postId/admin-reply | ✅ Admin | Add official admin reply |
| DELETE | /api/comments/:id | ✅ Owner/Admin | Delete comment |

---

## 🔐 Admin Access

To create an admin, register normally then manually update the role in MongoDB:
```javascript
db.users.updateOne({ email: "youremail@example.com" }, { $set: { role: "admin" } })
```

Or use the seed script for demo purposes.

---

## 🚢 Deployment

### Backend → Render / Railway / Heroku
1. Set environment variables on platform
2. Deploy backend folder
3. Set `MONGO_URI` and `JWT_SECRET`

### Frontend → Vercel / Netlify
1. Set `VITE_API_URL=https://your-backend-url.com/api`
2. Deploy frontend folder
3. Build command: `npm run build`, output: `dist`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| State | React Context API + Hooks |
