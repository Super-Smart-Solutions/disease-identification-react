import { useState, useCallback } from 'react';
import { fetchCurrentUser } from '../api/userAPI';

export const useUserData = () => {
    const [user, setUser] = useState(() => {
        // Initialize from localStorage if available
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const refetchUserData = useCallback(async () => {
        try {
            const userResponse = await fetchCurrentUser();
            localStorage.setItem('user', JSON.stringify(userResponse));
            setUser(userResponse);
            return userResponse;
        } catch (error) {
            console.error('Failed to fetch user data', error);
            throw error;
        }
    }, []);

    const clearUserData = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    return { user, refetchUserData, clearUserData };
};