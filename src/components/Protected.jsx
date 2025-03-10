import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.profile); // Get user from Redux store
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? children : null; // Render children if user exists, otherwise return null
};

export default ProtectedRoute;
