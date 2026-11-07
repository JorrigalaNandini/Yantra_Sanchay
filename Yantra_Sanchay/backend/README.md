# Backend - Yantra Sanchay

Node.js/Express backend server for Yantra Sanchay agricultural machinery platform.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure .env:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other configs
   ```

3. **Start server:**
   ```bash
   npm start
   # Development: npm run dev
   ```

Server runs on `http://localhost:5000`

## 📁 Folder Structure

- **config/** - Database configuration
- **models/** - MongoDB schemas (User, Machinery, Request, etc.)
- **controllers/** - Business logic handlers
- **routes/** - API endpoints
- **services/** - Utility services (translation, AI, recommendations)
- **middleware/** - Authentication, authorization middleware
- **server.js** - Main Express server

## 🔗 API Routes

```
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me
  POST   /api/auth/logout

Users:
  GET    /api/users
  GET    /api/users/:id
  PUT    /api/users/profile
  PUT    /api/users/:id
  DELETE /api/users/:id

Machinery:
  POST   /api/machinery
  GET    /api/machinery
  GET    /api/machinery/:id
  GET    /api/machinery/search
  PUT    /api/machinery/:id
  DELETE /api/machinery/:id
  GET    /api/machinery/user/my-machinery

Requests:
  POST   /api/requests
  GET    /api/requests
  GET    /api/requests/:id
  PUT    /api/requests/:id/status
  GET    /api/requests/user/my-requests

Pooling:
  POST   /api/pooling
  GET    /api/pooling
  GET    /api/pooling/:id
  POST   /api/pooling/:id/join
  PUT    /api/pooling/:id/status
  GET    /api/pooling/user/my-pooling

Translation:
  POST   /api/translate

Assessment:
  POST   /api/assessment

Admin:
  GET    /api/admin/statistics
  GET    /api/admin/users
  GET    /api/admin/machinery
  GET    /api/admin/requests
  GET    /api/admin/pooling
  PUT    /api/admin/machinery/:id/verify
  PUT    /api/admin/users/:id/toggle-status
```

## 🔐 Authentication

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with authMiddleware
- Role-based authorization

## 🗄️ Database Collections

- users
- machinery
- machinery_requests
- machinery_pooling
- assessments

## 📝 Error Responses

All errors follow consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details (development only)"
}
```

## ⚙️ Configuration

See `.env.example` for all available options.

### Required Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)

### Optional Variables
- `TRANSLATION_SERVICE_URL` - Python translation service URL
- `AI_API_KEY` - AI service API key
- `NODE_ENV` - Environment (development/production)

## 🧪 Testing API

Use Postman, Thunder Client, or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","phone":"9876543210","password":"password","role":"farmer"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Get machinery (public)
curl http://localhost:5000/api/machinery

# Get current user (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me
```

## 📦 Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcrypt - Password hashing
- jsonwebtoken - JWT handling
- axios - HTTP client
- cors - Cross-origin support
- dotenv - Environment variables

## 🛠️ Development

### Start with nodemon
```bash
npm run dev
```

### Debug mode
Set DEBUG environment variable:
```bash
DEBUG=* npm start
```

## 🚨 Troubleshooting

**MongoDB Connection Failed**
- Check connection string in .env
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**JWT Errors**
- Ensure token is passed in Authorization header
- Format: `Authorization: Bearer <token>`
- Check JWT_SECRET matches between encoding/decoding

**CORS Errors**
- Frontend URL should be allowed in CORS configuration
- Check server.cors() settings in server.js

## 📚 Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
