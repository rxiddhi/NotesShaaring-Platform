# Notes Sharing Platform

A full-stack web application where students can **upload**, **browse**, **search**, and **review** academic notes.

This project was collaboratively built by a team of 5 students from **Newton School of Technology**, under the guidance of faculty members and with support from the **Software Development Club (NST-SDC)**. What began as a summer open-source initiative for solving students **real-world problem** became a hands-on way to strengthen our skills in frontend, backend, databases, deployment, and teamwork.

🔗 [Live Website](https://notes-shaaring-platform.vercel.app/)

---

## Features
- Upload notes (PDF, DOCX, etc.)
- Browse & search by subject, title, or tags
- Personalized dashboard for managing uploaded and downloaded notes
- Ratings & reviews system to improve note quality
- Secure login/signup with Firebase Authentication
- Clean, responsive design for mobile and desktop

---

## Tech Stack

| Layer        | Tools Used                      |
|--------------|----------------------------------|
| Frontend     | React, Tailwind CSS              |
| Backend      | Node.js, Express.js              |
| Database     | MongoDB (Mongoose)               |
| Authentication | Firebase Auth                  |
| Deployment   | Vercel (Frontend), Render (Backend) |

---
## UI/UX Screenshots

1. HomePage (the landing page, light mode & dark mode toggle present)
<img width="3024" height="1712" alt="image" src="https://github.com/user-attachments/assets/763ea57d-4ff1-41b1-924c-e7281839de5a" />
<img width="3024" height="1710" alt="image" src="https://github.com/user-attachments/assets/b366f0c2-d70d-4e5c-b980-103a8c0f115a" />

2. Dashboard (tracks and updates all the activities, and can also navigate to different webpages)
<img width="3024" height="1720" alt="image" src="https://github.com/user-attachments/assets/552c0652-0f6a-491c-82ab-fcc9e9c290f0" />
<img width="3024" height="1708" alt="image" src="https://github.com/user-attachments/assets/f1f71015-6fbf-4b87-b485-b4aaf2157282" />

3a. Browse page (with all the relevant subjects and filters)
<img width="3024" height="1712" alt="image" src="https://github.com/user-attachments/assets/3b3d9c63-0652-4848-823e-f46ee0ec9508" />

3b. Review Button (On clicking the review button, it opens up this detailed information about the particular note, along with a preview and reviews)
<img width="3024" height="1708" alt="image" src="https://github.com/user-attachments/assets/63d6f424-87d8-4eb9-9b5a-b8ec48275403" />
<img width="3024" height="1714" alt="image" src="https://github.com/user-attachments/assets/530e1e33-6969-4bf3-a979-5e7ebbc6c703" />

4. Notes Upload Page (with functional and clear layout)
<img width="3024" height="1712" alt="image" src="https://github.com/user-attachments/assets/23bd30fa-eea5-4d52-b4db-c5f0aa001ad3" />

5. Doubts Page (helps in viewing and filtering all the doubts by users, also uploading the doubts)
<img width="3024" height="1708" alt="image" src="https://github.com/user-attachments/assets/884e0ff5-a736-4340-8785-dd860a4b9823" />
<img width="3024" height="1714" alt="image" src="https://github.com/user-attachments/assets/153dc4fd-53c9-4316-a40e-5f1908c1b098" />

6. Notes Page (Tracks uploaded and downloaded notes)
<img width="3020" height="1710" alt="image" src="https://github.com/user-attachments/assets/848ede6e-28a9-4114-9dd4-17a438a1ae79" />

---

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-username/notes-sharing-platform.git
cd notes-sharing-platform
```
### 2. Install Dependencies
```
cd backend
npm install
```
```
cd ../frontend
npm install
```
### 3. Environment Variables
Create a .env file in both the backend/ and frontend/ folders.

=> Example structure:

backend/.env
```
MONGO_URI=your_mongodb_uri
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```
frontend/.env
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```
### 4. Run the App Locally
Start both the backend and frontend in separate terminals:

Backend
```
cd backend
npm run dev
```
Frontend
```
cd frontend
npm start
```
Now open http://localhost:3000 in your browser.

## Folder Structure
```
notes-sharing-platform/
├── frontend/              # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── firebase.js
│   └── public/
│
├── backend/               # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
│
├── .gitignore
├── README.md
└── LICENSE
```
### Interested in Contributing
We’d love your help!

1. Fork the repository
2. Create a new branch: 
```
git checkout -b feature/your-feature
```
3. Make your changes
4. Commit:
```
git commit -m "Add your feature"
```
5. Push:
```
git push origin feature/your-feature
```
6. Open a Pull Request on GitHub

### The Contributors
- Vipul Yadav (vipul.k@adypu.edu.in) 
- Mridul (mridul.jyothi@adypu.edu.in)
- Riddhi Khera (riddhi.khera@adypu.edu.in)
- Nitin Sahu (nitin.sahu@adypu.edu.in)
- Ananya Gupta (ananya.gupta@adypu.edu.in)
- Amrit Kumar Mahto (amrit.mahto@adypu.edu.in)

---
#### Thank you for exploring our project, we hope you found it helpful :)
