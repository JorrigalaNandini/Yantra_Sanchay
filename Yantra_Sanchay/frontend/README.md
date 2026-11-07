# Frontend - Yantra Sanchay

React-based frontend for Yantra Sanchay agricultural machinery platform with PWA support.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

Frontend runs on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable components
├── services/        # API service calls
├── database/        # Dexie.js IndexedDB setup
├── hooks/          # Custom React hooks
├── context/        # React context providers
├── assets/         # Images, icons
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── App.css         # Global styles

public/
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker
└── pwa-*.png              # App icons
```

## 🎯 Features

### Pages
- **HomePage** - Landing page with features overview
- **LoginPage** - User login
- **RegisterPage** - User registration
- **RoleSelectionPage** - Choose user role
- **FarmerDashboard** - Farmer home
- **ProviderDashboard** - Provider home
- **AdminDashboard** - Admin dashboard
- **FindMachineryPage** - Search machinery
- **MachineryDetailsPage** - Machinery details
- **AddMachineryPage** - Add new machinery
- **TellMeWhatYouNeedPage** - NLP-based search
- **PhotoAssessmentPage** - Farm photo analysis
- **PoolingPage** - Machinery pooling
- **MyRequestsPage** - User's requests

### Components
- **Header** - Navigation bar with language selector
- **Footer** - Footer with links
- **ProtectedRoute** - Route protection
- **Status Indicator** - Online/offline status

## 🔗 API Service

Centralized API calls in `src/services/index.js`:

```javascript
import { 
  authService, 
  machineryService, 
  requestService,
  poolingService,
  adminService,
  translationService,
  assessmentService 
} from './services'
```

## 📱 Offline Support

Uses Dexie.js for local storage:
- IndexedDB for persistence
- Sync queue for pending requests
- Automatic sync when online
- Graceful fallbacks

## 🌐 Multilingual

Supports English, Telugu, Hindi through LanguageContext:

```javascript
import { useLanguage } from './context/LanguageContext'

// In component
const { language, translate, changeLanguage } = useLanguage()
```

## 🔐 Authentication

- JWT token stored in localStorage
- Automatic token inclusion in API headers
- Protected routes check authentication
- Role-based route access

## 🎨 Styling

- CSS modules for component styles
- Global styles in App.css
- CSS variables for theming
- Responsive design with media queries

## 🚀 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Output: dist/
```

### Preview Build
```bash
npm run preview
```

## 🌐 Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## 📦 Key Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **dexie** - IndexedDB wrapper
- **@vitejs/plugin-react** - React plugin for Vite

## 🛠️ Development

### Add New Page
1. Create component in `src/pages/`
2. Create CSS file
3. Add route in `App.jsx`
4. Link from navigation

### Add New API Service
1. Create service function in `src/services/index.js`
2. Use `api` instance for requests
3. Import in component
4. Use in useEffect or event handler

### Add Offline Support
1. Save to IndexedDB in `src/database/db.js`
2. Add to sync queue
3. Handle sync in useEffect

## 🎯 PWA Features

- **Install** - Add to home screen
- **Offline** - Cached pages work offline
- **Background Sync** - Auto-sync when online
- **Push Notifications** - (Configured in manifest)

Service Worker caching strategy:
- Network-first for API calls
- Cache-first for static assets

## 🔍 Debugging

Enable React DevTools browser extension for:
- Component inspection
- Props tracking
- State management

## 📝 Code Style

- ES6+ JavaScript
- JSX for components
- Functional components with hooks
- Clear naming conventions

## 🚨 Troubleshooting

**Blank Page**
- Check browser console for errors
- Verify VITE_API_URL is correct
- Check if backend server is running

**API Errors**
- Verify backend is running on port 5000
- Check CORS configuration
- Verify JWT token is valid

**Offline Not Working**
- Service Worker requires HTTPS (or localhost)
- Check browser console for SW errors
- Clear cache and reload

**Build Fails**
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Try: `npm run build`

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Guide](https://web.dev/progressive-web-apps/)
