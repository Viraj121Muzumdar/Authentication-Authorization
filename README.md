# Secure API with JWT & RBAC (Authentication & Authorization)

This project is a **Node.js/Express API** that implements **JWT-based authentication, user registration, login, and Role-Based Access Control (RBAC)** without a database.

---

## **🚀 Features**
✅ **User Registration & Login**  
✅ **JWT-Based Authentication**  
✅ **Role-Based Access Control (RBAC)**  
✅ **Secure Headers with Helmet.js**  
✅ **API Security Testing using Postman**  

---

## **📌 API Endpoints**
### **1️⃣ Register a User**
- **URL:** `POST /register`
- **Request Body:**
  ```json
  {
      "username": "admin",
      "email": "admin@example.com",
      "password": "securepassword",
      "role": "admin"
  }
