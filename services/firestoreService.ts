import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User, PlanType } from '../types';

/**
 * Create a new user document in Firestore
 */
export const createUserInFirestore = async (
    userId: string,
    userData: {
        email: string;
        name: string;
        avatarUrl?: string;
    }
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', userId);

        const newUser = {
            id: userId,
            email: userData.email,
            name: userData.name,
            avatarUrl: userData.avatarUrl || '',
            plan: PlanType.FREE,
            wordLimit: 500,
            wordsUsedToday: 0,
            writingStyles: [],
            role: 'user',
            status: 'active',
            joinedDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await setDoc(userRef, newUser);
        console.log('User created in Firestore:', userId);
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
        throw error;
    }
};

/**
 * Get user document from Firestore
 */
export const getUserFromFirestore = async (userId: string): Promise<User | null> => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            return {
                id: data.id,
                email: data.email,
                name: data.name,
                avatarUrl: data.avatarUrl,
                plan: data.plan as PlanType,
                wordLimit: data.wordLimit,
                wordsUsedToday: data.wordsUsedToday,
                writingStyles: data.writingStyles || [],
                role: data.role || 'user',
                status: data.status || 'active',
                joinedDate: data.joinedDate
            };
        }

        return null;
    } catch (error) {
        console.error('Error getting user from Firestore:', error);
        return null;
    }
};

/**
 * Update user document in Firestore
 */
export const updateUserInFirestore = async (
    userId: string,
    updates: Partial<User>
): Promise<void> => {
    try {
        const userRef = doc(db, 'users', userId);

        // Remove undefined values - Firestore doesn't accept them
        const cleanUpdates: Record<string, any> = {};
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                cleanUpdates[key] = value;
            }
        });

        await updateDoc(userRef, {
            ...cleanUpdates,
            updatedAt: serverTimestamp()
        });

        console.log('User updated in Firestore:', userId);
    } catch (error) {
        console.error('Error updating user in Firestore:', error);
        throw error;
    }
};

/**
 * Update last login timestamp
 */
export const updateLastLogin = async (userId: string): Promise<void> => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            lastLogin: new Date().toISOString(),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating last login:', error);
        // Don't throw - this is not critical
    }
};

/**
 * Sync Firestore user data to localStorage
 */
export const syncUserToLocalStorage = (user: User): void => {
    try {
        localStorage.setItem('humanize_ai_user', JSON.stringify(user));
        console.log('User synced to localStorage');
    } catch (error) {
        console.error('Error syncing user to localStorage:', error);
    }
};
