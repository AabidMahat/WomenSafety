# **Node.js Backend for Real-Time Location and Feedback Management**

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-brightgreen)](https://nodejs.org/)  
[![WebSocket](https://img.shields.io/badge/WebSocket-Supported-blue)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)  
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

This repository contains the backend for a real-time location and feedback management system. The application uses **Node.js** and WebSocket for real-time communication, integrates with third-party APIs for messaging and notifications, and manages data using modular controllers and models.

---

## **Table of Contents**
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**
- 🌐 **Real-Time Location Tracking**:  
  WebSocket-based system to send and display live user locations to assigned guardians.
- 📢 **Real-Time Feedback**:  
  WebSocket integration for instant feedback updates.
- 🔐 **Authentication**:  
  Secure user and guardian authentication with JWT.
- 📡 **Third-Party Integrations**:  
  - Firebase: Push notifications  
  - Twilio: SMS notifications  
  - Brevo (formerly Sendinblue): Email services  
- 🛠️ **Modular Design**:  
  Separation of concerns with models, controllers, and routers.

---

## **Tech Stack**
- **Backend**: Node.js with Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Real-Time Communication**: WebSocket  
- **Third-Party APIs**:  
  - Firebase (for messaging)  
  - Twilio (for SMS)  
  - Brevo (for email)  

---


## **Setup and Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/project-backend.git
   cd project-backend
