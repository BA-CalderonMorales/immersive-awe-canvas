
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "@/components/experience/LoadingOverlay";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to first world after a brief delay
    const timer = setTimeout(() => {
      navigate("/experience/genesis-torus", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <LoadingOverlay 
      message="Redirecting to the first world..." 
      theme="night" 
    />
  );
};

export default NotFound;
