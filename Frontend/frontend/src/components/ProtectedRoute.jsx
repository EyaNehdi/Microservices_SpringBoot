import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import Preloader from "../components/Preloader/Preloader";


const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth, checkAuth ,user} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);
  
  return (
    <>
      {isCheckingAuth ? (
        <Preloader />
      ) : isAuthenticated ? (
        <>
        
         
          <Outlet />
       
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default ProtectedRoute;
