# Offline Login Feature - Documentation

## Overview
The Yantra Sanchay app now supports offline login functionality, allowing users (especially farmers) to login even without internet connectivity, as long as they have logged in at least once while online.

---

## How It Works

### Online Login Flow
1. User enters credentials (name + phone for farmers, email for providers)
2. App checks internet connection - if **online**:
   - Sends credentials to server for authentication
   - Server validates and returns user data + JWT token
   - Credentials are **automatically saved locally** (encrypted/hashed password)
   - User is logged in and redirected to dashboard

### Offline Login Flow
1. User enters credentials
2. App checks internet connection - if **offline**:
   - System looks for the user in local database (IndexedDB)
   - If found, verifies password against stored hash
   - If password matches, creates offline session with mock token
   - User is logged in with **offline mode** indicator
   - Data syncs automatically when internet returns

### Registration
1. User registers with required fields (name, phone, password)
2. For farmers:
   - Location is auto-detected from device GPS
   - Email is optional
3. Once registration succeeds online:
   - Credentials are saved locally
   - User can login offline immediately after

---

## Technical Implementation

### Local Storage (IndexedDB via Dexie)
```javascript
// User data stored locally contains:
{
    id,           // User ID from server
    name,         // User's name
    phone,        // User's phone number
    email,        // User's email (if provided)
    role,         // 'farmer', 'machinery_provider', etc.
    passwordHash, // SHA-256 hashed password
    lastLoginDate,// Timestamp of last login
    isOfflineEnabled: true  // Flag to identify offline users
}
```

### Password Security
- Passwords are **hashed using SHA-256** when saved locally
- Original password is never stored
- When user enters password during offline login, it's hashed and compared
- Hashing is done client-side using Web Crypto API

### Connection Detection
- Uses `navigator.onLine` to detect internet status
- `useOnlineStatus` hook monitors online/offline events
- Updates UI in real-time when connection changes

### Data Sync
- Offline actions are queued in `syncQueue` table
- When connection returns, queued actions sync automatically
- Server acts as source of truth; offline data is supplementary

---

## Features

### 1. **Dual Login Mode**
- **Farmer Login**: Name + Mobile Number + Password
- **Email Login**: Email + Password (for machinery providers)

### 2. **Connection Status Display**
- Green indicator: Online ✅
- Red indicator: Offline ⚠️
- Shows warning message about offline mode limitations

### 3. **Automatic Credential Storage**
- No extra setup needed
- Happens automatically after successful online login/registration
- Can be cleared via `offlineAuthService.clearOfflineUsers()`

### 4. **Location Detection (Farmers)**
- Auto-detects GPS coordinates during registration
- Reverse geocodes to get location details
- Falls back to manual entry if detection fails

---

## API Reference

### offlineAuthService

#### `saveUserOffline(user, password)`
Saves user credentials locally for offline access.
```javascript
await offlineAuthService.saveUserOffline(user, password);
```

#### `authenticateOffline(name, phone, password)`
Authenticates farmer by name and phone (offline).
```javascript
const result = await offlineAuthService.authenticateOffline(name, phone, password);
if (result.success) {
    // Login successful
}
```

#### `authenticateOfflineByEmail(email, password)`
Authenticates user by email (offline).
```javascript
const result = await offlineAuthService.authenticateOfflineByEmail(email, password);
```

#### `getUserLocal(name, phone)`
Retrieves user from local database.
```javascript
const user = await offlineAuthService.getUserLocal(name, phone);
```

#### `getAllOfflineUsers()`
Gets all stored offline users.
```javascript
const users = await offlineAuthService.getAllOfflineUsers();
```

#### `clearOfflineUsers()`
Clears all offline user data.
```javascript
await offlineAuthService.clearOfflineUsers();
```

#### `updateLastLogin(userId)`
Updates user's last login timestamp.
```javascript
await offlineAuthService.updateLastLogin(userId);
```

---

## Browser Requirements

- **IndexedDB Support**: Required for local data storage
- **Web Crypto API**: Required for password hashing (SHA-256)
- **Geolocation API**: Required for location detection (optional, can be manual)

Most modern browsers support all these APIs:
- ✅ Chrome 60+
- ✅ Firefox 57+
- ✅ Safari 11+
- ✅ Edge 79+

---

## Security Considerations

### ✅ What's Protected
1. **Password hashing**: Passwords never stored in plain text
2. **Local storage**: Data stays on device, not cloud
3. **Offline token**: Generated locally, doesn't require server
4. **Web Crypto API**: Uses browser's built-in cryptography

### ⚠️ Limitations
1. **Device security**: If device is compromised, offline data can be accessed
2. **No OTP/2FA offline**: Two-factor authentication not available offline
3. **Data sync**: Offline changes sync without additional verification
4. **Password change**: Must be done online; requires new hash storage

### Best Practices
1. User should not share device to prevent unauthorized offline login
2. Regular online login recommended for security updates
3. Clear offline data if device is shared
4. Update password periodically

---

## User Experience

### During Registration
```
1. User fills form (name, phone, password, location)
2. Clicks "Register"
3. App saves locally if internet available
4. Success message shows with offline mode indicator
```

### During Login (Online)
```
1. Shows "🟢 Online" indicator
2. User can choose Farmer Login or Email Login
3. Credentials verified on server
4. Automatically saved locally
5. Redirected to dashboard
```

### During Login (Offline)
```
1. Shows "🔴 Offline Mode" indicator
2. Warning: "Login only works if you've logged in before online"
3. User enters credentials
4. Verified against local database
5. Logged in with offline badge in dashboard
6. Dashboard shows limited functionality
```

---

## Limitations & Considerations

### Offline Limitations
- ❌ Cannot register new accounts (no server)
- ❌ Cannot update profile data
- ❌ Cannot sync new machinery listings
- ❌ Cannot submit new requests
- ✅ Can view cached data
- ✅ Can view local user profile
- ✅ Can use read-only features

### When Syncing Returns
- All offline actions are queued
- Once online, sync happens automatically
- New data from server is fetched
- User gets notified of sync completion

---

## Testing Offline Login

### Manual Testing Steps

1. **First Login (Setup)**
   ```
   - Start app (online)
   - Register or login
   - Verify saved locally
   ```

2. **Test Offline Login**
   ```
   - Disconnect internet (DevTools > Network > Offline)
   - Refresh page
   - Try login with same credentials
   - Should succeed with offline indicator
   ```

3. **Test Failed Offline Login**
   ```
   - Disconnect internet
   - Try login with wrong password
   - Should show "Invalid password" error
   ```

4. **Test Sync Return**
   ```
   - Login offline
   - Re-enable internet
   - App detects online status
   - Auto-sync happens
   ```

### DevTools Testing
```javascript
// In browser console
navigator.onLine  // Check current status

// Manually trigger offline
// Chrome DevTools > Network > Throttling > Offline

// Check IndexedDB data
// Chrome DevTools > Application > IndexedDB > YantraSanchayDB
```

---

## Troubleshooting

### Issue: Offline login says "User not found locally"
**Solution**: User must login online at least once before offline login works.

### Issue: Offline login says "Invalid password"
**Solution**: Password must match exactly (case-sensitive, spaces matter).

### Issue: IndexedDB not working
**Solution**: 
- Check browser privacy settings
- Ensure cookies/storage not disabled
- Try different browser
- Check browser console for errors

### Issue: Location detection not working
**Solution**:
- Browser requires HTTPS for geolocation
- User must allow location permission
- Fall back to manual location entry

---

## Future Enhancements

1. **Data Sync Queue Visualization**
   - Show pending actions in offline mode
   - Manual sync trigger button

2. **Selective Offline Mode**
   - Download specific data for offline use
   - Cache farm machinery listings

3. **Offline-First Architecture**
   - Optimistic UI updates offline
   - Conflict resolution for sync

4. **Biometric Offline Login**
   - Fingerprint/Face ID for offline access
   - PIN backup option

5. **Encryption**
   - Encrypt local storage data
   - User-specific encryption keys

---

## Files Modified

- `frontend/src/services/offlineAuthService.js` - NEW
- `frontend/src/pages/LoginPage.jsx` - Updated
- `frontend/src/pages/RegisterPage.jsx` - Updated
- `frontend/src/pages/LoginPage.css` - Updated
- `frontend/src/services/index.js` - Updated
- `frontend/src/database/db.js` - Uses existing setup

---

## Related Components

- `useOnlineStatus` hook - Detects online/offline status
- `db` (Dexie) - Local database for offline data
- `syncQueue` - Queue for offline actions to sync
- `LanguageContext` - Handles multi-language support

---

## Questions?

For issues or questions about offline functionality:
1. Check browser console for errors
2. Verify IndexedDB is enabled
3. Test with DevTools offline mode
4. Check connection status indicator in UI
