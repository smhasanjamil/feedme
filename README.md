# FeedMe 🍱 – Personalized Meal Planning & Delivery Platform

A full-stack web application that bridges the gap between customers and meal providers through a dynamic platform for customized meal planning and seamless food delivery, based on dietary preferences and schedules.

## 🚀 Live Demo

🌐 [Live Frontend URL](https://feedme.vercel.app)  
🔗 [Backend Deployment](https://feedme-api.onrender.com) _(if applicable)_  
🎥 [Video Walkthrough](https://drive.google.com/your-demo-link)

---

## 📌 Features

### 👤 User Authentication & Roles

- Secure JWT-based login for **Customers** and **Meal Providers**
- Password encryption using **bcrypt**
- Role-based dashboards and access control

### 🍽 Customer Panel

- Browse, customize, and schedule meals
- Set dietary preferences (vegan, keto, gluten-free, etc.)
- Track active and past orders
- Edit delivery profile and preferences

### 👨‍🍳 Meal Provider Panel

- Manage meal listings with ingredients, pricing, and availability
- View, accept, or modify customer orders
- Update cuisine specialties and delivery options

### 🔍 Search & Match

- Customers can search meals based on cuisine, rating, or preferences
- Providers can view preferences to tailor meals

### 📬 Notifications (Email)

- Order status updates for customers and providers via email

---

## 🛠 Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [NextAuth (custom)](https://next-auth.js.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/) for media uploads

### Backend

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) for authentication
- [Nodemailer](https://nodemailer.com/) for emails

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB URI
- Cloudinary credentials
- SMTP email config (e.g., Gmail or Mailtrap)

### 1. Clone the repo

```bash
git clone https://github.com/ifajul89/feedme.git
cd feedme
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local`

```env
NEXT_PUBLIC_API_URL=https://feedme-backend-zeta.vercel.app
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=youremail@example.com
EMAIL_PASS=your_email_password
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to use the app locally.

---

## 📁 Project Structure

```
/pages          – Route-based files for Next.js
/components     – Reusable React components
/redux          – Global state management with slices
/api            – REST API endpoints for backend services
/models         – Mongoose schemas
/utils          – Helper functions (auth, email, cloudinary)
```

---

## 📹 Demo Overview (Must-Watch)

- User registration/login (Customer & Provider)
- Meal customization & scheduling
- Provider order management & menu creation
- Meal search and dietary preference filtering
- Email notification flow

---

## 🧑‍💻 Contributors

- **Ifajul** – [GitHub](https://github.com/ifajul89)  
  _(Project Lead & Full Stack Developer)_

---

## 📄 License

MIT License © 2025 Ifajul  
Feel free to fork and expand!

---

```

Let me know if you'd like to add badges, images, or contribution guidelines to this!
```
