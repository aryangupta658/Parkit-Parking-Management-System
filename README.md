# 🅿️ PARKit - Parking Management System

PARKit is a full-stack **MERN Stack Parking Management System** designed to help users search parking locations, book parking spaces, make secure online payments, and download invoices.

The system also provides a complete **Admin Dashboard** to manage parking locations, bookings, users, payments, reports, and parking availability.

This project is built as a full-stack application with real-world features like **JWT Authentication, Role-Based Access, Cloudinary Image Upload, Razorpay Payment Integration, Invoice Generation, Admin Reports, and Fully Responsive UI**.

---

## 🚀 Features

### 👤 User Features

- User signup and login
- Forgot password using OTP verification
- Search parking by location
- View available parking spaces
- Book one or multiple parking slots
- Fee summary calculation before payment
- Razorpay online payment integration
- View personal bookings
- Cancel bookings
- View payment history
- Download payment invoice
- Fully responsive user dashboard

---

### 🛠️ Admin Features

- Admin login with protected admin dashboard
- Add parking locations with images
- Upload parking images using Cloudinary
- Manage total spaces and available spaces
- Update parking slot status
- View all bookings
- Edit booking details
- Delete bookings
- View all registered users
- Edit user details
- Delete users
- View reports with charts
- Track revenue, booking status, payment status, and parking availability

---

## 🧰 Tech Stack

### 🎨 Frontend

- React.js
- React Router DOM
- Axios
- Recharts
- Lucide React Icons
- React Hot Toast
- CSS3

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- Bcrypt.js
- Multer
- Cloudinary
- Razorpay
- Nodemailer

---

## 📁 Folder Structure

```txt
Parking-Management-System/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── razorpay.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── slotController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── ParkingSlot.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── slotRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── uploadToCloudinary.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── FindParking.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminBookings.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminReports.jsx
│   │   │   ├── ManageSlots.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/aryanheree/parkit-parking-management-system.git
cd parkit-parking-management-system
```

---

## 🖥️ Backend Setup

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

### 3️⃣ Create Backend Environment File

Create a `.env` file inside the `backend` folder:

```bash
touch .env
```

Add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4️⃣ Run Backend Server

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

---

## 🌐 Frontend Setup

### 5️⃣ Install Frontend Dependencies

Open a new terminal and go to the frontend folder:

```bash
cd frontend
npm install
```

If you are still inside the backend folder, use:

```bash
cd ../frontend
npm install
```

### 6️⃣ Run Frontend

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

## 🔗 API Routes

### 🔐 Authentication Routes

```txt
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### 🅿️ Parking Slot Routes

```txt
GET    /api/slots
GET    /api/slots/available
POST   /api/slots
PUT    /api/slots/:id
DELETE /api/slots/:id
```

### 📅 Booking Routes

```txt
POST   /api/bookings
GET    /api/bookings/my-bookings
GET    /api/bookings/all-bookings
PUT    /api/bookings/cancel/:id
PUT    /api/bookings/complete/:id
PUT    /api/bookings/admin/:id
DELETE /api/bookings/admin/:id
POST   /api/bookings/create-order
POST   /api/bookings/verify-payment
```

### 🛠️ Admin Routes

```txt
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/reports
```

---

## 🔄 Main Functional Flow

### 👤 User Flow

1. User creates an account.
2. User logs in.
3. User searches parking by location.
4. User enters vehicle number, number of slots, start time, and end time.
5. System calculates total parking fee.
6. User completes payment through Razorpay.
7. Booking is confirmed.
8. User can view booking and payment history.
9. User can download invoice.
10. User can cancel booking if required.

---

### 🛠️ Admin Flow

1. Admin logs in.
2. Admin adds parking location with image, floor, area code, price, total spaces, and available spaces.
3. Admin can view and update parking availability.
4. Admin can manage all bookings.
5. Admin can edit or delete bookings.
6. Admin can manage users.
7. Admin can view reports with charts.
8. Admin can track total revenue, parking availability, booking status, and payment status.

---

## 📸 Screenshots

Add your project screenshots here after uploading them to GitHub.

```md
![Landing Page](screenshots/landing.png)
![Login Page](screenshots/login.png)
![User Dashboard](screenshots/user-dashboard.png)
![Find Parking](screenshots/find-parking.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
![Admin Reports](screenshots/admin-reports.png)
```

Recommended screenshots to add:

```txt
Landing Page
Login Page
Signup Page
Find Parking Page
My Bookings Page
Payments Page
Admin Dashboard
Manage Slots Page
Admin Reports Page
Mobile Responsive View
```

---

## 🔐 Environment Variables

The project uses environment variables for secure configuration.

Do not push your real `.env` file to GitHub.

Use `.env.example` to show required variables.

```txt
backend/.env          should not be pushed
backend/.env.example  should be pushed
```

---

## 🛡️ Security Notes

- Passwords are hashed before storing in the database.
- JWT is used for protected routes.
- Admin and user routes are protected separately.
- Sensitive keys are stored in environment variables.
- `.env` file is ignored using `.gitignore`.
- Cloudinary API keys and Razorpay secrets are not exposed publicly.

---

## 📊 Project Highlights

- Complete MERN stack architecture
- Role-based authentication
- Admin and user dashboards
- Real payment gateway integration
- Cloud image upload
- Invoice download system
- Search parking by location
- Multiple parking slot booking
- Responsive and mobile-friendly UI
- Charts and reports for admin

---

## 🔮 Future Improvements

- Add Google Maps integration
- Add real-time parking availability using Socket.io
- Add QR code based parking entry
- Add refund handling
- Add email invoice after successful payment
- Add admin analytics by month
- Add parking rating and reviews
- Deploy frontend and backend online

---

## 👨‍💻 Author

**Aryan Gupta**

GitHub: [@aryanheree](https://github.com/aryanheree)

---

## ✅ Project Status

Completed for academic, portfolio, and resume purpose.
