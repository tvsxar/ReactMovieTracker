import { createContext, useContext, useEffect, useState } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup } from 'firebase/auth';
import { app } from '../../firebase';
import { db } from '../../firebase';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion } from 'firebase/firestore';

// types
interface AuthContextType {
    user: any;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;

    addToFavorites: (movie: any) => Promise<void>;
    removeFromFavorites: (movieId: number) => Promise<void>;
    getFavorites: () => Promise<any[]>;
}
import { Movie } from '../contexts/MovieContext';

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    // authentication
    const auth = getAuth(app);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
    
        return () => unsubscribe();
    }, [auth]);

    const register = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    // favourites
    const addToFavorites = async (movie: Movie) => {
        if (!user) return;
        const ref = doc(db, 'users', user.uid);
        await setDoc(ref, { favorites: arrayUnion(movie) }, { merge: true });
    };

    const removeFromFavorites = async (movieId: number) => {
        if (!user) return;
        const ref = doc(db, 'users', user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const updated = (data.favorites || []).filter((m: any) => m.id !== movieId);
          await updateDoc(ref, { favorites: updated });
        }
    };

    const getFavorites = async () => {
        if (!user) return [];
        const ref = doc(db, 'users', user.uid);
        const snapshot = await getDoc(ref);
        return snapshot.exists() ? snapshot.data().favorites || [] : [];
    };

    return (
        <AuthContext.Provider value={{ user,
            register,
            login,
            logout,
            loginWithGoogle,
            addToFavorites,
            removeFromFavorites,
            getFavorites }}>
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}