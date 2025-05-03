
# FeedMe - Personalized Meal Planning & Delivery

FeedMe is a **Meal Planning & Delivery Web Application** that allows users to personalize their meal plans and schedule deliveries based on their dietary preferences. Customers can browse available meal options, select meals based on their preferences, and schedule delivery. Meal providers can manage menus, respond to customer orders, and track deliveries.

## Live URL

[Live Demo](https://feedme-meal.vercel.app/)
## Features

### 1. **User Authentication**

- Secure login system for customers and meal providers using email or phone number and password.
- **JWT (JSON Web Tokens)** for authentication.
- Passwords are securely hashed with **bcrypt**.

### 2. **Customer Dashboard**

- Browse meal options based on dietary preferences (vegan, keto, gluten-free, etc.).
- Track meal orders and past deliveries.
- Manage dietary preferences, cuisines, and portion sizes.

### 3. **Meal Provider Dashboard**

- Meal providers can create, update, and manage their menus.
- Respond to customer orders by accepting, modifying, or declining requests.

### 4. **Meal Selection & Customization**

- Customers can personalize meals based on dietary needs.
- Meal providers can specify ingredients, portion sizes, and pricing.

### 5. **Search and Match**

- Customers can search for meals based on cuisine, dietary preferences, ratings, and availability.
- Meal providers can view customer preferences and prepare meals accordingly.

### 6. **Role-Based Access Control**

- Custom dashboards and routes for customers and meal providers.
- Admin access for managing users and content.

### 7. **Email Notifications**

- Notifications for customers when meals are prepared and out for delivery.
- Notifications for meal providers when new orders are placed.
## Technology Stack

### Frontend

- **Next.js** (for SSR/SSG)
- **TypeScript** for type safety
- **React** for building user interfaces
- **Tailwind CSS** for styling

### Backend

- **Node.js** with **Express** for the RESTful API
- **MongoDB** for storing data (users, meal menus, orders)
- **JWT** for authentication
- **bcrypt** for password hashing
- **Nodemailer** for email notifications

### Additional Libraries & Tools

- **Redux** for state management
- **NextAuth** for authentication
- **Axios** for making HTTP requests
- **Cloudinary** for image uploads
## Routes

### Customer Routes:

- **Home Page:** Overview of the platform.
- **Login Page:** Login using email or phone number.
- **Dashboard:** Browse meals, manage orders and preferences.
- **Profile:** Edit personal details.
- **Find Meals:** Search for meals based on preferences.
- **Order Meal:** Place meal orders with customization options.

### Meal Provider Routes:

- **Home Page:** Overview of platform benefits for meal providers.
- **Login Page:** Login using email or phone number.
- **Dashboard:** Manage menus and orders.
- **Profile:** Edit meal provider profile, including available meals.
- **Post Meal Menu:** Post detailed meal menus for customers to browse.
- **Order Responses:** Respond to customer orders.