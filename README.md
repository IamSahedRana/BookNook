# 📚 BookNook – Online Library Management System

BookNook is a modern online library management platform where users can explore books, add their own books, borrow available copies, and manage their reading activity.

The goal of this project was to build a full-stack application while practicing modern web development concepts, authentication, database management, API integration, and real-world application functionality.

## 🌐 Live Demo

🔗 **Live Website:** [https://book-nook-coral.vercel.app/](https://book-nook-coral.vercel.app/)

🔗 **GitHub Repository:** [BookNook](https://github.com/IamSahedRana/BookNook)

---

# ✨ Features

- **Browse Books:** Explore the available book collection with a clean and organized interface.
- **Search & Filter:** Find books by title or author and filter them by categories.
- **Add Books:** Add new books with cover images and specify the number of available copies.
- **Borrow Books:** Borrow available books for a 7-day period.
- **Return Books:** Return borrowed books and automatically update available copies.
- **Book Management:** Edit and delete books added by the logged-in user.
- **Borrow Restrictions:** Prevent users from borrowing the same book multiple times simultaneously.
- **User Profile:** View personal statistics and active borrowing information.
- **Due Date Tracking:** Check upcoming return dates with due-soon reminders.
- **Authentication:** Secure email/password and Google authentication.
- **Protected Routes:** Restrict private pages and API operations to authorized users.
- **Theme Switching:** Light and dark mode support.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Smooth Animations:** Interactive UI with Motion animations and transitions.

---

# 🛠️ Technologies Used

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- React Icons
- SWR
- Swiper
- Motion

### Backend & Database

- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth
- JWT Authentication (jose)

### Form Handling & Validation

- React Hook Form
- Zod

### Deployment & Services

- Vercel
- MongoDB Atlas
- imgbb (Book Cover Image Hosting)

---

# 📖 Project Sections & Functionality

## 1. Home & Book Discovery

The home experience introduces users to the BookNook platform and helps them discover books from the available collection.

<p align="center">
  <img src="../booknook-client/public/images/slides/home.png" alt="BookNook Home Page" width="100%">
</p>

### Features

- Organized book collection
- Attractive book presentation
- Navigation to important pages
- Book discovery experience
- Responsive layout

## 2. All Books

The All Books section allows users to explore the complete book collection.

<p align="center">
  <img src="../booknook-client/public/images/slides/all-books.png" alt="All Books Page" width="100%">
</p>

### Features

- Display available books
- Search books by title or author
- Filter books by category:
  - Fiction
  - Science
  - History
  - Kids
  - Others
- Display book availability
- Navigate to individual book details

## 3. Book Details

Each book has an individual details page where users can explore its information and borrowing availability.

<p align="center">
  <img src="../booknook-client/public/images/slides/book-details.png" alt="Book Details Page" width="100%">
</p>

### Features

- Book cover and information
- Available copy count
- Borrowing functionality
- Availability status
- Borrowing restrictions
- Access to relevant book management actions

## 4. Add Book

Authenticated users can contribute to the library by adding new books.

<p align="center">
  <img src="../booknook-client/public/images/slides/add-book.png" alt="Add Book Page" width="100%">
</p>

### Features

- Book information form
- Book title and author
- Category selection
- Book description and details
- Cover image upload through imgbb
- Available copy quantity
- Form validation

## 5. My Books

The My Books section allows users to manage the books they have added.

<p align="center">
  <img src="../booknook-client/public/images/slides/my-books.png" alt="My Books Page" width="100%">
</p>

### Features

- View personally added books
- Edit existing book information
- Delete books
- Manage available copies
- Organized book management interface

## 6. My Borrows

Users can manage their borrowing activity from this section.

<p align="center">
  <img src="../booknook-client/public/images/pslides/my-borrows.png" alt="My Borrows Page" width="100%">
</p>

### Features

- View borrowed books
- Borrowing dates
- Expected return dates
- Return borrowed books
- Updated book availability after returning
- Due-soon reminders

## 7. Authentication System

BookNook provides secure authentication using Better Auth and MongoDB.

<p align="center">
  <img src="../booknook-client/public/images/slides/authentication.png" alt="Authentication Page" width="100%">
</p>

### Features

- Email and password authentication
- Google sign-in
- User session management
- JWT-secured API communication
- Protected application routes
- Authorized user operations

## 8. User Profile

The profile section provides an overview of the user's library activity.

<p align="center">
  <img src="../booknook-client/public/images/slides/Profile.png" alt="User Profile Page" width="100%">
</p>

### Features

- Personal account information
- Borrowing statistics
- Active borrowing records
- Upcoming return dates
- Due-soon information

---

# 🎨 Design Highlights

<p align="center">
  <img src="../booknook-client/public/images/slides/responsive-design.png" alt="BookNook Responsive Design" width="100%">
</p>

- Clean and modern library interface
- User-friendly navigation
- Consistent typography
- Organized book cards
- Responsive layouts
- Light and dark themes
- Smooth animations and transitions
- Interactive buttons and components
- Consistent spacing and visual hierarchy

---

# ⚙️ Key Development Concepts Practiced

While developing BookNook, I practiced:

- Next.js App Router
- Server and Client Components
- TypeScript
- REST API integration
- MongoDB database operations
- Authentication and authorization
- JWT verification
- Protected routes
- CRUD operations
- React Hook Form
- Zod validation
- Data fetching with SWR
- State management
- Environment variables
- Image uploading and hosting
- Responsive UI development
- API error handling
- Full-stack application architecture

---

# 📂 Project Structure

```text
BookNook/
│
├── public/
│   └── Website assets and static files
│
├── screenshots/
│   ├── home.png
│   ├── all-books.png
│   ├── book-details.png
│   ├── add-book.png
│   ├── my-books.png
│   ├── my-borrows.png
│   ├── authentication.png
│   ├── profile.png
│   └── responsive-design.png
│
├── src/
│   ├── app/
│   │   ├── (application routes)/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── proxy.ts
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

*Note: The structure above is a simplified overview of the application.*

---

# 💻 Run Locally

Follow these steps to run BookNook on your local machine.

### 1. Clone the repository

```bash
git clone https://github.com/IamSahedRana/BookNook.git
```

### 2. Navigate to the project directory

```bash
cd BookNook
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory and configure the required environment variables using `.env.example` as a reference.

### 5. Start the development server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

**Note:** BookNook also requires its separate Express.js backend API to be configured and running.

---

# 🔐 Environment Variables

The application requires the following environment variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | MongoDB database name |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth |
| `BETTER_AUTH_URL` | Application authentication URL |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb image hosting API key |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Development mock-data configuration |

Never commit actual credentials or secret keys to GitHub.

---

# 🚀 Deployment

BookNook uses separate frontend and backend deployments.

- **Frontend:** Vercel
- **Backend:** Express.js server hosted separately
- **Database:** MongoDB Atlas
- **Image Hosting:** imgbb

For additional deployment instructions, refer to the `DEPLOY.md` file.

---

# 🎯 Learning Goals

This project helped me strengthen my understanding of:

- Building full-stack applications with Next.js
- Designing reusable React components
- Working with TypeScript
- Connecting frontend applications with backend APIs
- Managing MongoDB databases
- Implementing authentication systems
- Understanding JWT-based authorization
- Building protected routes
- Handling real-world CRUD operations
- Managing application data and user activity
- Creating responsive and interactive interfaces
- Structuring scalable web applications

---

# 🙌 Acknowledgements

BookNook is part of my journey toward becoming a full-stack web developer.

Throughout this project, I focused on learning how different parts of a real-world application work together — from frontend development and API communication to database management and authentication.

Building BookNook helped me move beyond basic frontend projects and gain practical experience in developing a complete full-stack application.

---

⭐ **If you like this project, feel free to give it a star!**

Made with ❤️ by [Sahed Rana](https://github.com/IamSahedRana)
