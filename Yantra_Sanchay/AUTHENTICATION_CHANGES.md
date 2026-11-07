# Authentication System Changes for Farmer Users

## Overview
The authentication system has been updated to support farmer users who typically don't have email addresses. The new system uses **name + mobile number** for farmer login and registration, while maintaining email-based authentication for machinery providers and other users.

---

## Changes Made

### 1. **Backend - User Model** (`backend/models/User.js`)
- **Email field changes:**
  - Changed from required to optional
  - Applied `sparse: true` and `unique: true` to allow multiple users without emails
  
- **Location field enhancement:**
  - Added `latitude` and `longitude` for GPS coordinates
  - Added `accuracy` for geolocation accuracy
  - Kept existing `village`, `district`, and `state` fields

```javascript
location: {
    latitude: Number,
    longitude: Number,
    village: String,
    district: String,
    state: String,
    accuracy: Number,
}
```

### 2. **Backend - Authentication Controller** (`backend/controllers/authController.js`)

#### Register Endpoint Changes:
- **Validation:** Now only requires `name`, `phone`, `password`, and `role` (email is optional)
- **Duplicate check:** Changed to check for duplicate `name + phone` combination instead of email
- **Auto-generated email:** For farmers without email, system generates: `{name}_{phone}@yantra.local`
- **Location support:** Accepts and stores location data during registration

#### Login Endpoint Changes:
- **Dual authentication support:**
  - **Farmer login:** Uses `name + phone + password`
  - **Legacy email login:** Maintains backward compatibility with `email + password`
  - System automatically detects which login method is being used

```javascript
// Farmer login
{
  name: "John Doe",
  phone: "9876543210",
  password: "password123"
}

// Legacy email login (still supported)
{
  email: "user@example.com",
  password: "password123"
}
```

---

### 3. **Frontend - Login Page** (`frontend/src/pages/LoginPage.jsx`)

#### New Features:
- **Login type toggle:** Radio buttons to switch between "Farmer Login" and "Email Login"
- **Farmer Login Form:**
  - Name field
  - Mobile number field
  - Password field
- **Email Login Form (for providers & legacy users):**
  - Email field
  - Password field

#### Key Implementation:
```javascript
- loginType state controls which form is shown
- Form inputs change based on selected login type
- Both login methods send appropriate data to backend
```

---

### 4. **Frontend - Registration Page** (`frontend/src/pages/RegisterPage.jsx`)

#### New Features:

**For Farmers:**
1. **Auto-Location Detection:**
   - "Detect Location" button that uses Geolocation API
   - Automatically gets GPS coordinates (latitude, longitude)
   - Shows location accuracy in meters
   - Reverse geocoding to get village, district, state names
   
2. **Manual Location Editing:**
   - Village field (auto-filled, can be edited)
   - District field (auto-filled, can be edited)
   - State field (auto-filled, can be edited)

3. **Optional Email:**
   - Email field is completely hidden for farmers
   - Allows farmers to register without providing an email

**For Machinery Providers:**
- Email field remains required
- Location detection is not available

#### Registration Process:
```javascript
1. User selects "Farmer" or "Machinery Provider" role
2. Fills in name and mobile number
3. If Farmer:
   - System offers to detect location automatically
   - User can click "Detect Location" button
   - Location fields are auto-populated
   - User can manually edit location if needed
   - Email is optional
4. User sets password and confirms
5. Registration submission includes location data for farmers
```

---

### 5. **Frontend - Login Page Styles** (`frontend/src/pages/LoginPage.css`)

Added styles for:
- `.login-type-toggle`: Container for login type selection
- `.toggle-option`: Individual toggle buttons
- Radio button styling with active state highlighting

---

### 6. **Frontend - Registration Page Styles** (`frontend/src/pages/RegisterPage.css`)

Added styles for:
- `.location-section`: Container for location fields
- `.location-header`: Header with title and detect button
- `.btn-detect-location`: Detect location button styling
- `.location-status`: Success message styling
- `.location-coordinates`: GPS coordinates display

---

## User Experience Flow

### Farmer Registration:
1. Click "Register"
2. Select "Farmer" role
3. Enter Name and Mobile Number
4. Click "Detect Location" - automatically gets location
5. Review and edit location fields if needed
6. Set password
7. Complete registration

### Farmer Login:
1. Click "Login"
2. Toggle to "Farmer Login" (already default)
3. Enter Name and Mobile Number
4. Enter Password
5. Successfully logged in

### Machinery Provider Registration/Login:
- Works with email as before
- No automatic location detection
- Email is always required

---

## Database Considerations

### For Existing Users:
- Users with emails can continue to login using email
- Existing farmer accounts should be updated with location data
- Consider migration script for existing farmer users

### Unique Constraints:
- Email: Optional, unique (sparse index)
- Name + Phone: Acts as unique identifier for farmers

---

## Location Technology

- **Geolocation API:** Browser-based GPS coordinates
- **Reverse Geocoding:** OpenStreetMap Nominatim service (free, no API key required)
- **Fallback:** If user denies location permission, they can manually enter location details

---

## Security Notes

1. Passwords are hashed with bcrypt (10 rounds)
2. Location data is stored with accuracy information
3. Generated emails for farmers are internal only (yantra.local domain)
4. All endpoints maintain existing JWT-based authentication

---

## Testing Recommendations

1. **Test Farmer Registration:**
   - Verify location detection works
   - Verify location fields can be edited
   - Verify password matching

2. **Test Farmer Login:**
   - Login with name and phone
   - Verify token generation
   - Verify dashboard redirect

3. **Test Backward Compatibility:**
   - Email login still works
   - Existing users are not affected
   - Machinery providers still require email

4. **Test Edge Cases:**
   - Geolocation denied by user
   - Reverse geocoding fails
   - Duplicate name + phone registration
   - Special characters in name

---

## Environment Variables (Optional)
No new environment variables are required. The system uses:
- Existing JWT_SECRET for token generation
- Free OpenStreetMap Nominatim service for reverse geocoding

---

## Future Enhancements

1. **SMS Verification:** Add OTP verification via phone number
2. **Location Accuracy:** Show map picker for more precise location
3. **Offline Support:** Cache location data for offline functionality
4. **Analytics:** Track geolocation data for machinery distribution analysis
5. **Multi-language Location Names:** Get location names in local languages
