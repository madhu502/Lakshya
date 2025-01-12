# Entrance Preparation Application (Lakshya)- Backend

## Overview
The backend for the  Entrance Preparation Application (Lakshya) is built with Node.js and provides essential functionalities for managing quiz operations. It handles data management, authentication, and various API endpoints for creating quizzes, adding questions, adding resources, user management and payment.

# Features

## API Entpoints

**Quizzes API**
- POST/api/quizes/createquiz
  :Create a new quiz 

- GET/api/quizes/get_all_quizes
   : Retrieve all quizzes
  
**Play Quizzes API**
 - GET/api/quizes/quizbyid/${id}
   : To play quizzes

**Take Quiz**
- GET/api/quizes/${id}

**Resource API**
- POST/api/resource/add_resource
- GET/api/resource/get_all_resource
- DELETE/api/resource/delete_resource/${id}
- PUT/api/resource/update_resource/${id}

**Authentication API**
- POST/api/user/register
  : User Registration
  
- POST/api/user/login
  : User login to obtain a JWT token
  
- POST/api/user/forgot_password
  : Reset new password
  
- POST/api/user/verify_otp

# Authentication
- JWT-based Authentication
  : Secure User authentication using JSON Web Tokens (JWT).

# Technologies

- Node.js: Server-side runtime environment
- Express.js: Backend framework for building web applications.
- MongoDB: NoSQL database for storing data.
- Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.

# Environment Variables

The following environment variable must be set:

- **MONGODB_URI**: mongodb://localhost:27017/lakshya
- **JWT_SECRET:** SECRETKEY
- **PORT**: 5500

# Author
Madhu Kumari
