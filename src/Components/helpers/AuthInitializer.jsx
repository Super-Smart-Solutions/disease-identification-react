import { useEffect, useState } from 'react';
import { useUserData } from '../../hooks/useUserData';
import tokenManager from '../helpers/tokenManager';

const AuthInitializer = ({ children }) => {
  const { refetchUserData } = useUserData();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const token = tokenManager.getAccessToken();

      if (token) {
        try {
          await refetchUserData();
        } catch (error) {
          console.error("Session initialization failed (token might be invalid):", error);
        }
      }
      
      setIsInitializing(false);
    };

    initializeSession();
  }, [refetchUserData]); 

  if (isInitializing) {
    return <div className="fixed inset-0 bg-white flex items-center justify-center text-xl">Loading Session...</div>;
  }
  
  return children;
};

export default AuthInitializer;