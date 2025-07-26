
# 🅿️ Parq – Find & List Parking Easily

**Parq** is a full-stack web application that allows users to register and list their private parking spots, search for available parking in their area, and book a space in just a few clicks. Built with Vue 3 and Firebase, the app focuses on simplicity, accessibility, and responsive design.


## 📷 Screenshots

<img width="300" height="200" alt="image" src="https://github.com/user-attachments/assets/001143f9-382a-4dd5-9f6a-f2c3e8002b12" />

<img width="300" height="200" alt="image" src="https://github.com/user-attachments/assets/4e9db794-3789-4a41-ad75-53a564c891f2" />

<img width="300" height="200" alt="image" src="https://github.com/user-attachments/assets/3723dcc0-26e3-4515-a673-48404974a0f2" />

<img width="300" height="200" alt="image" src="https://github.com/user-attachments/assets/9e792073-98b5-44af-96cf-d120ac0f8292" />



## 🚀 Features

- 🔐 **Authentication**  
  Secure login using Firebase Authentication (Google and email/password support). Access to app content is restricted to authenticated users.

- 📝 **List a Parking Spot**  
  Multi-step form to add a parking spot with:
  - Features (e.g., charger, roof)
  - Dimensions
  - Availability (day/time-based rules)
  - Photos and custom guidelines
  - Location geocoded via Google Maps API

- 📍 **Search & Book**  
  - Search bar with filtering
  - Listings sorted by date or price
  - Clean, card-based UI with expandable details
  - Booking interface for selecting day/time

- 🌐 **Internationalization**  
  Language toggle for English and Norwegian (via `vue-i18n`).

- 💬 **User Feedback**  
  Alerts and UI feedback for validation, bookings, and listing submission.

## 👥 Contributors

- [Mari](https://github.com/marisolos) – Project Manager/Scrum Master  
- [Magnus](https://github.com/magnuuus) – Technical Lead  
- [Adnan](https://github.com/adovic) – Feature Developer  
- [Hedvig](https://github.com/shredvig) – Component Developer (Maps)  
- [Kaisa](https://github.com/Kaisab93) – Documentation & Diagrams  


Special thanks to our teachers Katerina Mangaroska and Boban Vesin at USN.

## 🛠️ Tech Stack

| Frontend     | Backend/Storage   | Other Tools         |
|--------------|-------------------|----------------------|
| Vue 3        | Firebase Firestore| Google Maps API      |
| Vue Router   | Firebase Auth     | Vue I18n             |
| Pinia (store)| Firebase Storage  | CropperJS (optional) |
| Bootstrap 5  |                   | Leaflet (experimental)|

## 🧪 MVP Scope

- Login & protected routes
- Listing form with rule-based availability
- Basic search, sort, and filter UI
- Image upload and preview
- Booking system (time + weekday)
- Clean, responsive design


## 📦 Setup & Run

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/my-parking-app.git
cd my-parking-app
npm install

