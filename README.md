# HobbyConnect

## About
This is a university group project for the Web Programming module. It is a web application for managing user hobbies, allowing users to add, edit, and explore hobbies. The project includes full CRUD functionality, user authentication, and a social component where users can connect based on shared interests. [Professor template used.](https://github.qmul.ac.uk/eew252/cwgroup)

### Features

- **User Authentication:** Signup, login, and logout using Django's authentication system
- **Profile Management:** Users can edit their name, email, date of birth, password, and hobby list
- **Hobby Management:** Users can add new hobbies to the database, making them available to all users
- **Hobby Exploration:** Users can view and explore hobbies added by others
- **Similar Users List:** Displays users with the most shared hobbies, sorted in descending order
- **Filtering:** Users can filter similar users by age range
- **Friend System:** Users can send, accept, and manage friend requests via AJAX
- **Pagination:** Ensures optimal performance and user experience
- **Asynchronous Updates:** Dynamic content updates using Vue.js and fetch API
- **Full Stack Type Safety:** TypeScript in Vue and type annotations in Python
- **Automated Testing:** End-to-end Selenium tests covering key features
- **Deployment:** Designed to be deployed on the EECS OpenShift platform

# Project Information

## Technologies Used

- **Frontend:** Vue.js, Pinia, TypeScript, Bootstrap
- **Backend:** Django, Django Rest Framework (DRF), Python 3.11
- **Database:** PostgreSQL (or SQLite during development)
- **Authentication:** Django authentication framework
- **Testing:** Selenium-based end-to-end (E2E) testing

## How to Run the Project

### Step 1: Setting up Environment
Create a conda environment and activate it
```
conda create hobbies_app
conda activate hobbies_app
```
Install dependencies
```
pip install -r requirements.txt
cd frontend
npm install
```

### Step 2: Run the Frontend

```
cd frontend
npm run dev
```
Access the frontend at: [http://localhost:5173](http://localhost:5173)

### Step 3: Run the Backend

```
python manage.py runserver
```
Access the backend at: [http://localhost:8000](http://127.0.0.1:8000)


## Users (Test Accounts)

### Admin
- **[admin2@outlook.com](mailto:admin2@outlook.com)** - GroupPass12
### Others
- **[jesus@me.com](mailto:jesus@me.com)** - GroupPass12
- **[sophie@me.com](mailto:sophie@me.com)** - GroupPass12
- **[cheesy@me.com](mailto:cheesy@me.com)** - GroupPass12\*
- **[lolly@me.com](mailto:lolly@me.com)** - GroupPass12\*

## Project Visuals
![Front Page](https://github.com/jmalekx/Hobbies-App/blob/main/visuals/frontpage.png)
---
![Home Page](https://github.com/jmalekx/Hobbies-App/blob/main/visuals/homepage.png)
---
![Profile Page](https://github.com/jmalekx/Hobbies-App/blob/main/visuals/profilepage.png)
---
![Friends Page](https://github.com/jmalekx/Hobbies-App/blob/main/visuals/friendspage.png)
---
![Hobbies Page](https://github.com/jmalekx/Hobbies-App/blob/main/visuals/hobbiespage.png)
---
![Similar Users Page](https://github.com/jmalekx/Hobbies-App/blob/main/visuals/similarusers.png)
---
![Filtered Users Page](https://github.com/jmalekx/Hobbies-App/blob/main/visuals/filteredsimilarusers.png)

## Collaborators
- [**jmalekx**](https://github.com/jmalekx): created friend model, admin hobby and friend classes, added to hobby model, setup api urls, user profile and creation forms, working logout button, fixed filtering with default auto max/min ages, fixed filtering previous button, all selenium tests, code commenting. login and signup forms.
- [**CatrionaLAnderson**](https://github.com/CatrionaLAnderson): Set up the project environment, Vue.js routing, and user authentication (signup, login, logout, and user tracking). Built the frontend and backend for hobbies management, similar users (pagination and sorting), and the age filter using AJAX. Developed the friends system (friends list, requests, and approvals), created Pinia stores, added error handling for unknown routes, and test.py fro friends and final age filter. Url.py
- [**darenagos**](https://github.com/darenagos): Set up Custom user models, integrated Pinia, completed the Profile Vue page. Made use of static types in Python and in the Vue Files. Helped with debugging/errors. Url.py.  
