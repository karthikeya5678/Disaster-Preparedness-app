# Disaster Preparedness and Response Education System

A comprehensive, full-stack web application designed to integrate disaster management education into the curriculum for schools and colleges in India. This platform provides interactive learning modules, real-time progress tracking, gamified experiences, and location-aware safety features to create a more disaster-resilient generation.

## 🚀 Live Application Link

* **Live Frontend (GitHub Pages):** `https://karthikeya5678.github.io/Disaster-Preparedness-app`

## ✨ Key Features

This application features a robust, role-based system to cater to the unique needs of every stakeholder in the educational ecosystem.

### For Students

* **Personalized Dashboard:** A dynamic hub showing a live weather outlook, regional disaster alerts, and a summary of their learning progress.
* **Interactive e-Learning:** A Coursera-style course catalog with modules containing videos, text lessons, and quizzes.
* **Real-time Progress Tracking:** A dedicated "My Progress" page showing completed lessons and detailed quiz results.
* **Gamification & Achievements:** An exciting "Game Arcade" with multiple interactive games, plus a badge and achievement system to reward course completion.
* **Profile Management:** Students can view their unique User ID (to share with parents) and manage their personal details.

### For Parents

* **Secure Child Linking:** A secure system where a teacher must approve the link between a parent and student account.
* **Progress Monitoring:** A dedicated dashboard to view their child's completed courses and earned badges.
* **Profile Management:** The ability to view and edit their child's profile information.
* **Live Drill Information:** A dynamic dashboard card that shows the next upcoming drill at their child's school.

### For Teachers & Admins

* **Student-Parent Management:** A powerful portal for teachers to securely link student accounts to their parents.
* **Drill Management:** A full CRUD (Create, Read, Update, Delete) interface for scheduling and managing institutional drills.
* **Real-time Analytics:** A live-updating view of drill participation statistics, including completion percentages and student counts.

### For Super Admins

* **Content Management System (CMS):** A dedicated, full-screen portal to create, edit, and delete entire educational courses and their lessons.

## 🔑 Sample Credentials for Testing

To explore the full functionality of the application, please use the following pre-configured user accounts.

* **Email and Password for student:** `pabbisettikarthikeya@gmail.com` and `admin@123`
* **Email and Password for parent:** `parent@gmail.com` and `parent@123`
* **Email and Password for admin:** `admin@gmail.com` and `Admin@123`

| Role                | Email                       | Institution ID    | Notes                                                                                                                                                             |
| :------------------ | :-------------------------- | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🧑‍🎓 **Student** | `student.rohan@example.com` | `oakridge-hyd-01` | The main user. Can take courses and play games.                                                                                                                   |
| 🧑‍🏫 **Teacher** | `teacher.priya@example.com` | `oakridge-hyd-01` | Can manage students and view drills.                                                                                                                              |
| 👨‍👩‍👧 **Parent** | `parent.amit@example.com`   | `N/A` (at signup) | **IMPORTANT:** This account will not work until you log in as the **Teacher** first and link this parent to the student "Rohan Verma" on the "Manage Students" page. |
| 👑 **Super Admin** | `superadmin@example.com`    | `N/A`             | Has access to the powerful Content Management System to create new courses.                                                                                         |

## 💻 Tech Stack

This project is a modern, full-stack monorepo application built with a focus on scalability and user experience.

* **Frontend:** React, TypeScript, Vite, CSS Modules, Axios
* **Backend:** Node.js, Express.js
* **Database & Auth:** Firebase (Firestore, Authentication)
* **File Storage:** AWS S3 (for secure video hosting)
* **Live Services:** OpenWeatherMap API
* **Deployment:** Render (Backend), GitHub Pages (Frontend)

## 🛠️ How to Run Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* Git

### Installation & Setup

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/karthikeya5678/Disaster-Preparedness-app.git](https://github.com/karthikeya5678/Disaster-Preparedness-app.git)
    cd Disaster-Preparedness-app
    ```

2.  **Setup the Backend:**
    ```sh
    cd backend
    npm install
    ```
    * Create a `.env` file in the `backend` directory and add your secret keys for Firebase, AWS S3, and OpenWeather.
    * Place your Firebase `serviceAccountKey.json` in `backend/src/config/`.

3.  **Setup the Frontend:**
    ```sh
    cd ../frontend
    npm install
    ```
    * Create a `.env` file in the `frontend` directory.
    * Add `VITE_FIREBASE_API_KEY=your_key` and `VITE_API_URL=http://localhost:8080`.

4.  **Run the Application:**
    * In one terminal, run the backend: `cd backend && npm run dev`
    * In a second terminal, run the frontend: `cd frontend && npm run dev`
