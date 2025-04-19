import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser } from '../api/userAPI';

export const useUserData = () => {
    const queryClient = useQueryClient();


    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        initialData: () => {

            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        onSuccess: (data) => {
            if (data) {
                localStorage.setItem('user', JSON.stringify(data));
            }
        },
        onError: (error) => {
            console.error('Failed to fetch user data', error);
        }
    });


    const { mutate: clearUserData } = useMutation({
        mutationFn: () => {
            localStorage.removeItem('user');
            return Promise.resolve(null);
        },
        onSuccess: () => {
            queryClient.setQueryData(['currentUser'], null);
        }
    });

    return {
        user,
        isLoading,
        isError,
        refetchUserData: refetch,
        clearUserData
    };
};