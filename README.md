
# Job Portal - Easily

Project Easily is a user-friendly job portal designed to streamline job listings, applications, and notifications. Built using modern web technologies such as Node.js, Express.js, and EJS, the project enables users to sign up, log in securely with JWT authentication, apply for jobs, and receive real-time email notifications about job applications and updates.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Deployment](#deployment)
4. [Navigate the Project](#navigate-the-project)
   - [Controllers](#controllers)
   - [Models](#models)
   - [Routes](#routes)
   - [Views](#views)
5. [Installation](#installation)
6. [Usage](#usage)

---

## Introduction

This project is designed to simplify job listings and applications. It supports authentication, category-based job filtering, and streamlined email notifications using Node.js and EJS.

---

## Features

- **Authentication:** Secure login and registration with JWT and bcrypt.
- **Email Notifications:** Send email updates using Nodemailer with EJS templates.
- **Category-Based Job Listings:** Filter jobs dynamically by category.
- **Responsive Design:** Built using EJS and CSS for a seamless user experience.
- **Error Handling:** Comprehensive middleware for error handling.
- **Optimized File Handling:** File uploads managed securely without bloating sessions.

---

## Deployment

1. Clone this repository to your local system.
2. Install dependencies with `npm install`.
3. Set up the `.env` file with the required variables.
4. Run the project using `node index.js`.

---

## Navigate the Project

### Controllers

- **applicant.controller.js:** Handles application-related logic, including submitting and retrieving applications.
- **user.controller.js:** Manages user authentication and profile details.
- **job.controller.js:** Deals with job creation, updates, and listings.
- **error.controller.js:** Custom error handling logic.

### Models

- **applicant.model.js:** Schema for applicant details.
- **user.model.js:** User schema for authentication and profile.
- **job.model.js:** Defines job attributes like title, category, and description.
- **category.model.js:** Represents job categories for filtering.

### Routes

- **applicant.routes.js:** Endpoints for application submission and management.
- **user.routes.js:** User-related routes for login, registration, and profile updates.
- **job.routes.js:** Job management endpoints, including CRUD operations.

### Views

- **applicant-list.ejs:** Displays all applications submitted.
- **job-listing.ejs:** Lists available jobs filtered by categories.
- **login.ejs, register.ejs:** Forms for user authentication.
- **err-page.ejs:** Custom error pages.

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/username/repository-name.git
   cd repository-name
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory with the following details:
   ```env
   NODE_ENV=development
   SESSION_SECRET=your-secret-key
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   ```

4. **Run the Application:**
   ```bash
   node index.js
   ```

---

## Usage

1. Open the application in your browser.
2. Register a new account or log in with existing credentials.
3. Browse and apply for jobs based on categories.
4. Admin users can create, update, and delete job listings.
5. Receive email notifications for application submissions.
