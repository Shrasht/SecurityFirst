# SecurityFirst

A full-stack safety and navigation application that helps users find the safest routes, share live location, send emergency alerts, and manage a personal safety profile. Built with React (frontend), Flask (backend), and HERE Maps API.

---

##  Features

- **Safe Route Planning:**
  - Visualize and select the safest routes using HERE Maps, with safety scoring and route highlights.
- **Live Location Sharing:**
  - Share your real-time location with trusted contacts via email.
- **Emergency Alerts:**
  - Instantly notify emergency contacts with your location and a custom message.
- **Safety Profile:**
  - Manage your personal info, emergency contacts, and safety preferences.
- **Help Points & Heatmap:**
  - View nearby help points and safety heatmaps for dark or risky zones.
- **Modern UI:**
  - Responsive, mobile-friendly design with animated markers and clear route visualization.

---

## 🛠️ Tech Stack

- **Frontend:** React, HERE Maps JS API, EmailJS
- **Backend:** Flask (Python), REST API
- **Styling:** CSS Modules
- **Other:** Context API, LocalStorage, Error Boundaries

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/SafeRoutes.git
cd SafeRoutes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```
REACT_APP_HERE_MAPS_API_KEY=your_here_maps_api_key
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

### 4. Start the frontend

```bash
npm start
```

### 5. Start the backend

```bash
cd backend
pip install -r requirements.txt
flask run
```

---

## 📂 Project Structure

```
SecurityFirst/
│
├── backend/
│   └── routes/
│       └── heatmap.py
│   └── ...
├── src/
│   ├── components/
│   │   └── map/
│   │   └── safety/
│   │   └── routing/
│   ├── context/
│   ├── pages/
│   ├── App.js
│   └── ...
├── .env
├── .gitignore
├── README.md
└── ...
```

---

## 📝 Usage

- **Find Safe Routes:**
  - Enter source and destination, click "Find Safest Routes" to view and select routes on the map.
- **Share Live Location:**
  - Use the dashboard quick action to send your current location to contacts.
- **Send Emergency Alert:**
  - Trigger an alert to notify all emergency contacts with your location.
- **Manage Safety Profile:**
  - Add/edit personal info and emergency contacts in the Safety Profile section.

---

## 🛡️ License

This project is for educational and demonstration purposes.

---

## 🙏 Acknowledgements

- [HERE Maps](https://developer.here.com/)
- [EmailJS](https://www.emailjs.com/)
- [React](https://react.dev/)
- [Flask](https://flask.palletsprojects.com/)

---
PPT LINK:https://www.canva.com/design/DAGoUzYkALk/Gd8flw-MPcyjZ5DrKmHzgw/edit?utm_content=DAGoUzYkALk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

*For any issues or contributions, please open an issue or pull request!*
