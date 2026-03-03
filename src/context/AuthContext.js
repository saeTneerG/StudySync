import React, { createContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = { id: user.uid, ...docSnap.data() };
                setUserInfo(userData);
            } else {
                console.log("No such document!");
            }

            setUserToken(user.uid);
        } catch (e) {
            console.log(`Login error ${e}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password, faculty = '', major = '', year = '') => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const newUserInfo = {
                name,
                email,
                faculty,
                major,
                year
            };

            await setDoc(doc(db, "users", user.uid), newUserInfo);

            setUserInfo({ id: user.uid, ...newUserInfo });
            setUserToken(user.uid);
        } catch (e) {
            console.log(`Register error ${e}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
            setUserToken(null);
            setUserInfo(null);
        } catch (e) {
            console.log(`Logout error ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updatedData) => {
        if (!userInfo || !userInfo.id) return;
        try {
            const userRef = doc(db, "users", userInfo.id);
            await updateDoc(userRef, updatedData);

            setUserInfo({ ...userInfo, ...updatedData });
        } catch (e) {
            console.log(`Update profile error ${e}`);
            throw e;
        }
    };

    const deleteAccount = async () => {
        setIsLoading(true);
        try {
            if (auth.currentUser) {
                await deleteDoc(doc(db, "users", auth.currentUser.uid));
                await auth.currentUser.delete();
            }
            setUserToken(null);
            setUserInfo(null);
        } catch (e) {
            console.log(`Delete account error ${e}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserToken(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserInfo({ id: user.uid, ...docSnap.data() });
                }
            } else {
                setUserToken(null);
                setUserInfo(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, userInfo, updateProfile, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};
