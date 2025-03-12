import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchUserProfile from "../features/fetchUserProfile";
import supabase from "../services/supabaseClient";

const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          navigate("/login");
          return;
        }

        const profile = await fetchUserProfile(user.id);

        if (profile?.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error in admin check:", err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return isAdmin ? <>{children}</> : null;
};

export default ProtectedAdminRoute;
