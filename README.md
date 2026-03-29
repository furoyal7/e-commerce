# 🛒 E-Commerce Platform

A full-stack e-commerce application featuring a powerful admin dashboard, dynamic product management, and a seamless shopping experience.

---

## 🚀 Features

### 🛠️ Admin Panel

* Create, edit, delete, and publish products
* Manage categories and product visibility
* Advanced filtering and search
* Real-time product updates

### 🛍️ User Experience

* Browse products with category filtering
* Add to cart functionality
* Checkout system
* Responsive UI

### ⚙️ Backend System

* RESTful API built with NestJS
* Scalable architecture
* Secure data handling with Prisma ORM

---

## 🧰 Tech Stack

* **Frontend:** Next.js
* **Backend:** NestJS
* **Database:** Prisma ORM
* **Language:** TypeScript

---

## 📂 Project Structure

```
ecommerce-app/
│── backend/    # NestJS API
│── frontend/   # Next.js app
```

---

## ⚡ Getting Started

### 1️⃣ Clone the repository

```
git clone https://github.com/furoyal7/e-commerce.git
cd e-commerce
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
npm run start:dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend folder:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

## 📌 API Overview

* `GET /api/products` → Get published products
* `POST /api/products` → Create product (Admin)
* `PATCH /api/products/:id/publish` → Publish product
* `POST /api/cart` → Add to cart

---

## 🎯 Future Improvements

* Payment integration (Stripe)
* User authentication system
* Order tracking
* Admin analytics dashboard

---

## 🌍 Live Demo

*(Add your deployed link here)*

---

## 👨‍💻 Author

Developed by **Fuad Kedir**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
