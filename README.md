# Portfolio Platform

A portfolio platform built using **Node.js** that supports user authentication, two-factor authentication (2FA), email notifications, and role-based authorization. The platform enables users to manage their portfolios with CRUD operations and provides adaptive design for a seamless user experience.

---

## Features

### Authentication and Authorization
- **User Registration**: Users can register by providing their details (username, password, first name, last name, age, and gender). A welcome email is sent upon successful registration.
- **User Login**: Users log in with their username and password. If 2FA is enabled, they must provide a token from an authenticator app.
- **Roles**:
  - **Administrator**: Full access to all features.
  - **Editor**: Can add and update portfolio items but cannot delete them.

### Portfolio Management
- **CRUD Operations**:
  - **Create**: Add new portfolio items with title, description, and up to three images.
  - **Update**: Modify existing portfolio items.
  - **Delete**: Only admins can delete portfolio items.
  - **Retrieve**: View all portfolio items or specific items by ID.

### Email Notifications
- Integrated with **Nodemailer** and **Mailtrap** for:
  - Welcome emails after registration.
  - Notifications about significant platform activities.

### Security
- Passwords are securely hashed using **bcrypt**.
- Two-factor authentication implemented with **speakeasy** and **qrcode**.

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Security**: bcrypt, speakeasy, qrcode
- **Email Service**: Nodemailer with Mailtrap
- **Frontend**: HTML, CSS, EJS templates
- **Tools**: dotenv, multer (for image uploads), nodemon (for development)

---

## Setup Instructions

### Prerequisites
1. Install **Node.js** and **npm**.
2. Set up a **MongoDB Atlas** account for database access.
3. Create a **Mailtrap** account for email testing.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/portfolio-platform.git
   cd portfolio-platform
