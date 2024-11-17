# Portfolio Platform

A comprehensive portfolio platform built with **Node.js**, designed to showcase projects and manage user profiles with modern features like two-factor authentication (2FA), email notifications, and adaptive design.

---

## Key Features

### User Management
- **User Registration**: New users can create accounts by providing basic information (username, password, first name, last name, age, and gender). A confirmation email is sent to new users upon successful registration.
- **Login with 2FA**: After entering their credentials, users with enabled 2FA must provide a token from an authenticator app for additional security.
- **Roles and Permissions**:
  - **Admin**: Full access to manage users and portfolio items.
  - **Editor**: Can create and update portfolio items but cannot delete them.
  - **Viewer**: Limited to viewing portfolio content.

### Portfolio Management
- **CRUD Operations**:
  - Create: Add new portfolio items, including a title, description, and up to three images.
  - Read: View all portfolio items or specific items by ID.
  - Update: Modify portfolio items (title, description, or images).
  - Delete: Only admins can delete items to ensure content control.

### Email Notifications
- Integrated with **Nodemailer** for:
  - Welcome emails upon registration.
  - Notifications about new portfolio items or updates.

### Two-Factor Authentication (2FA)
- Secure implementation using **speakeasy** and **qrcode** libraries.
- Configurable during account setup, with an option to enable or disable it later.

### Adaptive Design
- User-friendly interface with responsive layouts to ensure accessibility on all devices.

---

## Technologies Used

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for API and server setup.
- **Mongoose**: MongoDB object modeling for schema management.

### Frontend
- **HTML5 & CSS3**: Core structure and styling.
- **EJS**: Templating engine for dynamic content rendering.

### Security
- **bcrypt**: Secure password hashing.
- **speakeasy & qrcode**: Libraries for implementing 2FA.

### Email Integration
- **Nodemailer**: For sending emails.
- **Mailtrap**: For email testing and debugging.

---

## Getting Started

### Prerequisites
1. Install **Node.js** and **npm**.
2. Create accounts on:
   - **MongoDB Atlas**: For the database.
   - **Mailtrap**: For email service.

### Installation
   Clone this repository:
   ```bash
   git clone https://github.com/your-username/portfolio-platform.git
   cd portfolio-platform
