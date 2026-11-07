# 🚜 YANTRA SANCHAY

**Yantra Sanchay** is a government-oriented agricultural machinery access and sharing platform designed to help farmers easily discover, request, access, and share agricultural machinery while helping machinery owners/providers manage their equipment.

## 🎯 Key Features

- ✅ **Smart Machinery Search** - Find agricultural machinery by category, location, crop, and availability
- ✅ **Machinery Pooling** - Coordinate with nearby farmers to share machinery costs
- ✅ **Photo-Based Farm Assessment** - Upload farm photo and get machinery recommendations
- ✅ **Tell Me What You Need** - Natural language-based machinery discovery system
- ✅ **Multilingual Support** - English, Telugu, Hindi
- ✅ **Offline-First PWA** - Access data without internet connection
- ✅ **Machinery Verification** - Government-verified machinery listings
- ✅ **Role-Based Access** - Separate dashboards for Farmers, Providers, and Admins
- ✅ **Real-Time Synchronization** - Automatic data sync when connectivity returns

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18
- Vite
- React Router DOM
- Axios
- Dexie.js (IndexedDB)
- PWA & Service Worker

**Backend:**
- Node.js + Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication
- bcrypt for password hashing

## 📁 Project Structure

```
Yantra_Sanchay/
├── frontend/
│   ├── public/
│   │   ├── manifest.webmanifest
│   │   ├── sw.js
│   │   └── pwa-*.png
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── database/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Python translation service (optional, for multilingual support)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example):
   ```bash
   cp .env.example .env
   ```

4. **Configure .env:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/yantra_sanchay
   PORT=5000
   JWT_SECRET=your-secret-key-here
   TRANSLATION_SERVICE_URL=http://127.0.0.1:8000
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

   Build output: `dist/`

## 🔑 User Roles

### 1. Farmer
- Search for agricultural machinery
- Request machinery
- Create machinery pooling
- Upload farm photos for assessment
- View request status
- Use offline mode

### 2. Machinery Provider
- List agricultural machinery
- Manage machinery inventory
- View farmer requests
- Approve/reject requests
- Update machinery availability

### 3. Admin
- User management
- Machinery verification
- Platform statistics
- Request monitoring
- District-wise analytics

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Machinery
- `GET /api/machinery` - Get all machinery (with filters)
- `GET /api/machinery/:id` - Get machinery details
- `POST /api/machinery` - Add machinery (provider only)
- `PUT /api/machinery/:id` - Update machinery
- `DELETE /api/machinery/:id` - Delete machinery
- `GET /api/machinery/search?q=query` - Search machinery

### Requests
- `POST /api/requests` - Create machinery request
- `GET /api/requests` - Get requests
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id/status` - Update request status

### Machinery Pooling
- `POST /api/pooling` - Create pooling
- `GET /api/pooling` - Get all pooling
- `GET /api/pooling/:id` - Get pooling details
- `POST /api/pooling/:id/join` - Join pooling
- `PUT /api/pooling/:id/status` - Update pooling status

### Translation
- `POST /api/translate` - Translate text
  ```json
  {
    "text": "Hello",
    "source": "english",
    "target": "telugu"
  }
  ```

### Assessment
- `POST /api/assessment` - Get farm assessment

### Admin
- `GET /api/admin/statistics` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/machinery` - All machinery
- `GET /api/admin/requests` - All requests
- `PUT /api/admin/machinery/:id/verify` - Verify machinery

## 🌐 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/yantra_sanchay
PORT=5000
JWT_SECRET=your-secret-key
TRANSLATION_SERVICE_URL=http://127.0.0.1:8000
AI_API_KEY=
NODE_ENV=development
```

### Frontend (vite.config.js)
```
VITE_API_URL=http://localhost:5000/api
```

## 📱 PWA Features

- **Install on Mobile** - Add to home screen
- **Offline Mode** - Access cached data without internet
- **Background Sync** - Automatic sync when online
- **Fast Loading** - Service Worker caching strategy

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt
- **JWT Authentication** - Stateless authentication
- **Role-Based Authorization** - Protected routes and APIs
- **Input Validation** - Server-side validation
- **CORS Protection** - Configured CORS headers
- **No credentials in code** - Environment variables

## 🔧 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### Port Already in Use
```bash
# Change PORT in .env or kill the process
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

### Translation Service Unavailable
- The app continues working with fallback to English
- Configure TRANSLATION_SERVICE_URL if using local Python service

### PWA Not Installing
- Ensure HTTPS in production (or localhost for dev)
- Check manifest.webmanifest is accessible
- Service Worker must be registered

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

## 📚 Additional Resources

### MongoDB Setup
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Create database user
4. Add IP address to whitelist
5. Copy connection string to .env

### Translation Service (Optional)
For multilingual support, set up a Python translation service or use:
- Google Cloud Translation API
- Azure Translator
- AWS Translate

## 📝 Database Models

### User
- name, email, phone, password
- role (farmer, machinery_provider, admin)
- profile (farm details, organization info)
- location (village, district, state)
- preferredLanguage

### Machinery
- machineryName, category, brand, model
- owner, images, location
- availability, pricing
- verificationStatus, rating

### MachineryRequest
- machinery, farmer, provider
- requiredDate, duration
- status (pending, approved, rejected, completed)

### MachineryPooling
- title, description, machineryType
- participants, status
- location, crop, farmSize

### Assessment
- farmer, image
- assessmentData
- recommendations

## 🎨 UI/UX Principles

- **Rural-Friendly** - Large buttons, simple navigation
- **Accessibility** - High contrast, keyboard navigation
- **Mobile-First** - Responsive design for all devices
- **Offline Indication** - Clear online/offline status
- **Language Support** - Multilingual interface

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Configure environment variables

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy using Git or Docker
3. Configure MongoDB connection

## 📄 License

MIT License

## 🤝 Support

For issues and feature requests, please create an issue in the project repository.

---

**Made with ❤️ for Indian Farmers**
