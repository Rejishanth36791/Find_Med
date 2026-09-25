# FindMyMeds

FindMyMeds is a web application designed to help patients locate required medications, check real-time availability across local pharmacies, and reserve prescriptions online. It also provides pharmacies with stock management tools and gives administrators system-wide oversight.

---

## Leadership and Project Roles

- **Project Guidance and Supervision:** **EJ Yohan Methusael** (`Methu25` / `yohanjason25@gmail.com`)  
  Guided the team throughout the project, managed the repository, and supervised the overall development workflow.

- **System Design and Core Development:** **MTR Mathota** (`coder-chetto` / `thisarirashvini@gmail.com`)  
  Played the main technical role in designing the architecture, building key backend services and frontend interfaces, and implementing the core reservation and notification systems.

---

## Team Contributors

The project was developed collaboratively by the following team members:

- **EJ Yohan Methusael (`Methu25` / `METHU25`)** — Project guidance, repository management, code integration, and route fixes.
- **MTR Mathota (`coder-chetto`)** — Core system architecture, civilian workflow layout, reservation module, notification center, and activity tracking.
- **Yashara Gamage (`YasharaGamage` / `Yash2`)** — Reporting and appeal workflows, civilian authentication backend, multi-role login implementation, and related UI components.
- **K.U. K. Rakshan (`Rakshan200417`)** — UI component integration, merge conflict resolution, and build artifact cleanup.
- **P. Rejishanth (`P.Rejishanth`)** — Pharmacy analytics dashboard, inventory management features, reporting services, and database dumps.
- **Dumidu (`Dumee-25` / `KADP Kumarapeli`)** — Backend integrations and supporting feature implementation.
- **Gaweesha (`Gaweesha` / `Kumarathunga`)** — Reservation process workflow design and DTO definitions.
- **Chamidudayan (`chathuranga`)** — Frontend UI component enhancements.
- **Sanith Sathnidu (`Sanith Sathnidu`)** — Security updates and supporting backend modules.
- **Sandil Ranmeth (`rwsrrajasekara`)** — Initial frontend prototypes and styling setup.

---

## Features

### Civilian Portal
- **Pharmacy and Medicine Search:** Search for required medicines by name and locate nearby participating pharmacies using integrated maps.
- **Prescription Reservations:** Reserve medications directly at selected pharmacies.
- **Activity and Notifications:** Track ongoing reservation statuses and receive updates in real time.

### Pharmacy Portal
- **Inventory Management:** Add, update, and monitor medicine stock levels.
- **Reservation Workflow:** Review and process incoming reservation requests (Pending, Approved, Rejected, Completed).
- **Reports and Analytics:** View pharmacy inventory metrics and generate summary reports.

### Administrator Portal
- **System Dashboard:** Manage pharmacy registration approvals, user activity, and global application settings.
- **Medicine Registry:** Maintain the master list of approved medicine items.
- **Appeals and Reports:** Manage civilian and pharmacy feedback, support requests, and system logs.

---

## Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.x (Java 21)
- **Security:** Spring Security with JWT (JSON Web Tokens)
- **Database:** MySQL with Spring Data JPA and Hibernate
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18 (Vite 7.x)
- **Styling:** Vanilla CSS & Tailwind CSS v4, Lucide React icons
- **Maps:** Leaflet & React-Leaflet
- **Charts & Reports:** Chart.js, React-Chartjs-2, jsPDF
- **HTTP Client & Routing:** Axios, React Router DOM v7

---

## Project Structure

```
FindMyMeds/
├── backend/                  # Spring Boot Java application
│   ├── src/main/java/        # Controllers, Services, Models, Security Configs
│   ├── src/main/resources/   # Application properties & SQL scripts
│   └── pom.xml               # Maven configuration
├── frontend/                 # React application
│   ├── src/
│   │   ├── API/              # Axios client setup
│   │   ├── components/       # UI components
│   │   ├── context/          # State management (Auth, Notifications)
│   │   ├── pages/            # Application pages (Civilian, Pharmacy, Admin)
│   │   └── services/         # API service calls
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite bundler configuration
├── database/                 # Database schema files and dumps
├── admin_postman_collection.json    # Postman collection for Admin API endpoints
└── pharmacy_postman_collection.json # Postman collection for Pharmacy API endpoints
```

---

## Getting Started

### Prerequisites
- JDK 21 installed on your system
- Node.js (v18 or higher recommended) and npm
- MySQL server running locally or remotely

### 1. Database Setup
1. Create a MySQL database named `findmymeds` (or update `backend/src/main/resources/application.properties` with your database name).
2. Execute the initial SQL files found in the `database/` folder, or allow Spring JPA to generate the tables on startup.

### 2. Running the Backend
```bash
cd backend
./mvnw spring-boot:run
```
By default, the backend API runs at `http://localhost:8080` (or `8081` depending on configuration).

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on the local Vite dev server (typically `http://localhost:5173`).

---

## License
Developed as part of a collaborative coursework project for healthcare and medicine inventory management.
