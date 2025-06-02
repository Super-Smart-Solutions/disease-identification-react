import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useDocumentTitle() {
  const location = useLocation();
  
  useEffect(() => {
    const routeName = location.pathname.split('/').pop();
    const formattedName = routeName 
      ? routeName.charAt(0).toUpperCase() + routeName.slice(1)
      : 'Home';
    
    document.title = `Murshidk - ${formattedName}`;
  }, [location]);
}