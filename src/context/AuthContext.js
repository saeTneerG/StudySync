import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // Simulate user "database" in AsyncStorage
            const existingUsers = await AsyncStorage.getItem('users');
            let users = [];
            if (existingUsers) {
                users = JSON.parse(existingUsers);
            }

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Simulate generating token
                const token = 'fake-jwt-token';
                setUserToken(token);
                setUserInfo(user);
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userInfo', JSON.stringify(user));
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (e) {
            console.log(`Login error ${e}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const existingUsers = await AsyncStorage.getItem('users');
            let users = [];
            if (existingUsers) {
                users = JSON.parse(existingUsers);
            }

            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Create new user (Faculty/Year empty by default)
            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                faculty: '',
                year: ''
            };

            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));

            // Auto login after register
            const token = 'fake-jwt-token';
            setUserToken(token);
            setUserInfo(newUser);
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(newUser));

        } catch (e) {
            console.log(`Register error ${e}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');

            if (userInfo) {
                setUserInfo(JSON.parse(userInfo));
            }
            setUserToken(userToken);
            setIsLoading(false);
        } catch (e) {
            console.log(`isLogged in error ${e}`);
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const newInfo = { ...userInfo, ...updatedData };
            setUserInfo(newInfo);
            await AsyncStorage.setItem('userInfo', JSON.stringify(newInfo));

            // Also update in the main 'users' array
            const existingUsers = await AsyncStorage.getItem('users');
            let users = [];
            if (existingUsers) {
                users = JSON.parse(existingUsers);
                const userIndex = users.findIndex(u => u.email === userInfo.email);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...updatedData };
                    await AsyncStorage.setItem('users', JSON.stringify(users));
                }
            }
        } catch (e) {
            console.log(`Update profile error ${e}`);
            throw e;
        }
    };

    // Clear all data (for "Delete Data" button)
    const deleteAccount = async () => {
        setIsLoading(true);
        try {
            // Remove from users list
            const existingUsers = await AsyncStorage.getItem('users');
            let users = [];
            if (existingUsers) {
                users = JSON.parse(existingUsers);
                users = users.filter(u => u.email !== userInfo.email);
                await AsyncStorage.setItem('users', JSON.stringify(users));
            }

            // Logout
            await logout();
        } catch (e) {
            console.log(`Delete account error ${e}`);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, userInfo, updateProfile, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};
