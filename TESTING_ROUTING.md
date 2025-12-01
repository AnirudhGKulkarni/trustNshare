# Testing & Debugging Guide

## How to Test the Routing Fix

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for these debug messages:
- "Login - User profile:" - Shows the loaded user profile
- "Token claims:" - Shows Firebase Auth token claims
- "HomeRedirect - Profile:" - Shows profile in redirect logic
- "Redirecting to [role] dashboard" - Shows which dashboard is being used

### 2. Verify Firestore Profile

**Important**: Make sure your user has a proper profile in Firestore!

Go to Firebase Console → Firestore Database → `users` collection

For **Super Admin**, the document should have:
```
Document ID: [user's UID]
{
  email: "superadmin@secureshare.com"
  firstName: "Super"
  lastName: "Admin"
  role: "super_admin"    // ← IMPORTANT!
  company: "SecureShare"
  domain: "System"
  status: "active"
  createdAt: [timestamp]
}
```

For **Admin**, the document should have:
```
Document ID: [user's UID]
{
  email: "admin@example.com"
  firstName: "Admin"
  lastName: "User"
  role: "admin"    // ← IMPORTANT!
  company: "Company Name"
  domain: "IT"
  status: "active"
  createdAt: [timestamp]
}
```

For **Client**, the document should have:
```
Document ID: [user's UID]
{
  email: "client@example.com"
  firstName: "Client"
  lastName: "User"
  role: "client"    // ← IMPORTANT!
  company: "Company Name"
  domain: "Customer"
  status: "active"
  createdAt: [timestamp]
}
```

### 3. Test Login Flow

1. **Clear browser cache and localStorage**:
   ```javascript
   // In browser console:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Login as Super Admin**:
   - Email: `superadmin@secureshare.com`
   - Password: [your password]
   - Expected: Redirect to `/super-admin`
   - Console should show: "Welcome Super Admin!"

3. **Login as Admin**:
   - Email: [admin email]
   - Password: [admin password]
   - Expected: Redirect to `/dashboard`
   - Console should show: "Welcome Admin!"

4. **Login as Client**:
   - Email: [client email]
   - Password: [client password]
   - Expected: Redirect to `/client`
   - Console should show: "Login successful!"

### 4. Common Issues & Fixes

#### Issue: Always redirects to client dashboard

**Cause**: Firestore profile doesn't exist or role field is missing/incorrect

**Fix**:
1. Check Firestore Console for the user's document in `users` collection
2. Verify the `role` field exists and is spelled correctly
3. The UID must match the Firebase Auth UID exactly

#### Issue: "Permission denied" error

**Cause**: Firestore security rules don't allow reading user profile

**Fix**: Update Firestore rules to allow users to read their own profile:
```javascript
match /users/{userId} {
  allow read: if request.auth.uid == userId;
  allow write: if request.auth.uid == userId || 
               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
}
```

#### Issue: Redirect happens but shows wrong dashboard

**Cause**: Role-based routing protection is working but profile role is wrong

**Fix**: 
1. Double-check the `role` field in Firestore (case-sensitive!)
2. Should be exactly: `"super_admin"`, `"admin"`, or `"client"`
3. No extra spaces or typos

### 5. Manual Profile Creation Steps

If a user doesn't have a Firestore profile:

1. Get the user's UID from Firebase Console → Authentication
2. Go to Firestore Database → `users` collection
3. Click "Add document"
4. Document ID: Paste the UID
5. Add fields as shown in section 2 above
6. Click "Save"
7. User can now login and will be routed correctly

### 6. Verify Changes Made

The following files were updated to fix routing:

1. **Login.tsx**:
   - Now waits for profile to load before routing
   - Added console logs for debugging
   - Checks role in correct order: super_admin → admin → client

2. **AuthContext.tsx**:
   - `login()` now waits for `loadProfile()` to complete
   - Profile is loaded before returning user object

3. **App.tsx (HomeRedirect)**:
   - Added console logs for debugging
   - Fixed routing priority: super_admin → admin → client
   - Falls back to token claims if profile not found

4. **RoleProtectedRoute.tsx**:
   - Already supports super_admin role
   - Redirects to correct dashboard based on role

### 7. Testing Checklist

- [ ] Super admin can login and see `/super-admin` dashboard
- [ ] Admin can login and see `/dashboard` 
- [ ] Client can login and see `/client` dashboard
- [ ] Console shows correct debug messages
- [ ] No "permission denied" errors
- [ ] Logout and re-login works correctly
- [ ] Browser refresh maintains correct dashboard
- [ ] Protected routes redirect unauthorized users

### 8. If Still Not Working

1. **Clear all browser data**:
   - Settings → Clear browsing data
   - Check: Cookies, Cached images, Local storage
   - Time range: All time

2. **Check Firestore profile manually**:
   ```javascript
   // In browser console after login:
   import { getAuth } from 'firebase/auth';
   import { getFirestore, doc, getDoc } from 'firebase/firestore';
   
   const auth = getAuth();
   const firestore = getFirestore();
   const uid = auth.currentUser?.uid;
   
   if (uid) {
     const profile = await getDoc(doc(firestore, 'users', uid));
     console.log('Profile exists:', profile.exists());
     console.log('Profile data:', profile.data());
   }
   ```

3. **Restart dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Check network tab**:
   - Look for Firestore API calls
   - Check if profile fetch succeeded
   - Look for any 403/404 errors

### 9. Quick Test Script

Run this in browser console after login to verify profile:

```javascript
// Check current user
console.log('Auth User:', firebase.auth().currentUser);

// Check Firestore profile
const uid = firebase.auth().currentUser?.uid;
if (uid) {
  firebase.firestore().collection('users').doc(uid).get()
    .then(doc => {
      console.log('Profile exists:', doc.exists);
      console.log('Profile data:', doc.data());
      console.log('Role:', doc.data()?.role);
    });
}
```

## Expected Console Output

### Super Admin Login:
```
Login - User profile: { role: "super_admin", email: "superadmin@...", ... }
Welcome Super Admin!
Redirecting to super admin dashboard
```

### Admin Login:
```
Login - User profile: { role: "admin", email: "admin@...", ... }
Welcome Admin!
Redirecting to admin dashboard
```

### Client Login:
```
Login - User profile: { role: "client", email: "client@...", ... }
Login successful!
Redirecting to client dashboard
```
