import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { getUser, loginUser, signupUser, logoutUser as logoutStorage } from '../services/storageService';
import { User } from '../types';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateName: (name: string) => Promise<void>;
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
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const email = firebaseUser.email;
                if (email) {
                    // Check if user exists in local storage DB, sync it
                    // We use the email to map Firebase User to Local Storage User for now
                    // In a real app, we would fetch from a database using UID
                    let appUser = loginUser(email);

                    // If new user via Google, ensure name is set
                    if (firebaseUser.displayName && appUser.name !== firebaseUser.displayName && appUser.wordsUsedToday === 0) {
                        // Update name if it's a fresh account or matching email
                        // This is a basic sync, can be improved
                    }
                    setCurrentUser(appUser);
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
                signupUser(user.email, user.displayName || 'Google User');
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
        loginUser(email);
    };

    const signupWithEmail = async (email: string, pass: string, name: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(result.user, { displayName: name });
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

    return (
        <AuthContext.Provider value={{ currentUser, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout, updateName }}>
            {children}
        </AuthContext.Provider>
    );
};
