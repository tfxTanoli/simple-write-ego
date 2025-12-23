import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { getUser, loginUser, signupUser, logoutUser as logoutStorage } from '../services/storageService';
import { createUserInFirestore, getUserFromFirestore, updateLastLogin, syncUserToLocalStorage } from '../services/firestoreService';
import { User } from '../types';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateName: (name: string) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const email = firebaseUser.email;
                if (email) {
                    try {
                        // Try to fetch user from Firestore first
                        let appUser = await getUserFromFirestore(firebaseUser.uid);

                        if (appUser) {
                            // Update last login
                            await updateLastLogin(firebaseUser.uid);
                            // Sync to localStorage
                            syncUserToLocalStorage(appUser);
                            setCurrentUser(appUser);
                        } else {
                            // Fallback to localStorage if Firestore doesn't have the user
                            appUser = loginUser(email, firebaseUser.displayName || undefined);
                            setCurrentUser(appUser);
                        }
                    } catch (error) {
                        console.error('Error fetching user from Firestore:', error);
                        // Fallback to localStorage
                        const appUser = loginUser(email, firebaseUser.displayName || undefined);
                        setCurrentUser(appUser);
                    }
                }
            } else {
                // User is signed out
                setCurrentUser(null);
                logoutStorage();
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            if (user.email) {
                // Check if user exists in Firestore
                const firestoreUser = await getUserFromFirestore(user.uid);

                if (!firestoreUser) {
                    // First time Google login - create user in Firestore
                    await createUserInFirestore(user.uid, {
                        email: user.email,
                        name: user.displayName || 'Google User',
                        avatarUrl: user.photoURL || undefined
                    });
                }

                // Also save to localStorage for backward compatibility
                signupUser(user.email, user.displayName || 'Google User');
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        loginUser(email, result.user.displayName || undefined);
    };

    const signupWithEmail = async (email: string, pass: string, name: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(result.user, { displayName: name });

        // Create user in Firestore
        await createUserInFirestore(result.user.uid, {
            email,
            name
        });

        // Also save to localStorage for backward compatibility
        signupUser(email, name);
    };

    const logout = async () => {
        await signOut(auth);
        logoutStorage();
        setCurrentUser(null);
    };

    const updateName = async (name: string) => {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name });
            // Also update in local storage
            const user = getUser();
            if (user) {
                // Logic to update local user name is handled by SettingsPage calling updateUserProfile
                // We just trigger a refresh or ensure the user state is updated if needed
                // But for now, we rely on the component to update local storage
            }
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        if (!auth.currentUser || !auth.currentUser.email) {
            throw new Error('No user is currently logged in');
        }

        // Reauthenticate user before changing password (Firebase security requirement)
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

        try {
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
        } catch (error: any) {
            // Handle specific Firebase errors
            if (error.code === 'auth/wrong-password') {
                throw new Error('Current password is incorrect');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('New password is too weak. Please use at least 6 characters');
            } else if (error.code === 'auth/requires-recent-login') {
                throw new Error('Please log out and log back in before changing your password');
            }
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout, updateName, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
