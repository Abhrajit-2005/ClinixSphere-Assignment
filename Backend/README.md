## 📥 Installation

# Prerequisites - 

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (v5.0+ recommended)

## 🚀 Steps

# Get the root directory path of your project

```bash
cd ClinixSphere
cd backend
```

# Install dependencies

```bash
npm install
```

# Setup Environment Variables

Create a .env file by copying the .env.example and placing the values

# Start the development server

```bash
npm run dev
```
(uses nodemon to restart the server on file changes)

or start the server normally

```bash
npm start
```
## Test API's 

Base URL - http://localhost:{PORT}/ 
Check the API documentation for more information

## Sample Data

Patient details -
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "mypassword",
  "role": "patient"
}

Doctor details -
{
  "name": "Bob",
  "email": "bob@example.com",
  "password": "mypassword",
  "role": "doctor"
}