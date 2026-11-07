import { db } from '../database/db';

/**
 * Offline Authentication Service
 * Manages offline login with locally stored credentials
 */

export const offlineAuthService = {
    /**
     * Save user credentials locally for offline access
     * @param {Object} user - User object from server
     * @param {string} password - User's password (will be hashed)
     */
    saveUserOffline: async (user, password) => {
        try {
            const offlineUser = {
                id: user._id || user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                passwordHash: await hashPassword(password),
                lastLoginDate: new Date(),
                isOfflineEnabled: true,
            };

            await db.users.put(offlineUser);
            console.log('User saved for offline access');
            return true;
        } catch (error) {
            console.error('Error saving user offline:', error);
            return false;
        }
    },

    /**
     * Authenticate user with name/phone and password locally
     * @param {string} name - User's name
     * @param {string} phone - User's phone number
     * @param {string} password - User's password
     */
    authenticateOffline: async (name, phone, password) => {
        try {
            // Search for user by name and phone
            const users = await db.users.toArray();
            const user = users.find(
                (u) => u.name.toLowerCase() === name.toLowerCase() && u.phone === phone
            );

            if (!user) {
                return {
                    success: false,
                    message: 'User not found locally. Please login online first.',
                };
            }

            // Verify password
            const isPasswordValid = await verifyPassword(password, user.passwordHash);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid password',
                };
            }

            return {
                success: true,
                user: {
                    _id: user.id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                },
                message: 'Logged in offline mode',
            };
        } catch (error) {
            console.error('Error during offline authentication:', error);
            return {
                success: false,
                message: 'Offline authentication failed',
            };
        }
    },

    /**
     * Authenticate with email for offline (for machinery providers)
     */
    authenticateOfflineByEmail: async (email, password) => {
        try {
            const user = await db.users.where('email').equals(email).first();

            if (!user) {
                return {
                    success: false,
                    message: 'User not found locally. Please login online first.',
                };
            }

            const isPasswordValid = await verifyPassword(password, user.passwordHash);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid password',
                };
            }

            return {
                success: true,
                user: {
                    _id: user.id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                },
                message: 'Logged in offline mode',
            };
        } catch (error) {
            console.error('Error during offline email authentication:', error);
            return {
                success: false,
                message: 'Offline authentication failed',
            };
        }
    },

    /**
     * Check if user exists in local database
     */
    getUserLocal: async (name, phone) => {
        try {
            const users = await db.users.toArray();
            return users.find(
                (u) => u.name.toLowerCase() === name.toLowerCase() && u.phone === phone
            );
        } catch (error) {
            console.error('Error fetching user locally:', error);
            return null;
        }
    },

    /**
     * Get all offline-enabled users
     */
    getAllOfflineUsers: async () => {
        try {
            return await db.users.where('isOfflineEnabled').equals(true).toArray();
        } catch (error) {
            console.error('Error fetching offline users:', error);
            return [];
        }
    },

    /**
     * Clear all offline user data
     */
    clearOfflineUsers: async () => {
        try {
            await db.users.clear();
            console.log('Offline user data cleared');
            return true;
        } catch (error) {
            console.error('Error clearing offline users:', error);
            return false;
        }
    },

    /**
     * Update user last login date
     */
    updateLastLogin: async (userId) => {
        try {
            await db.users.update(userId, {
                lastLoginDate: new Date(),
            });
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    },
};

/**
 * Simple password hashing using Web Crypto API
 * Note: This is a basic implementation. For production, use more robust solutions.
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 */
async function verifyPassword(password, hash) {
    const hashOfInput = await hashPassword(password);
    return hashOfInput === hash;
}
