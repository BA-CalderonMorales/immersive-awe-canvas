
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface UseUrlSyncProps {
  worldData: any;
}

export const useUrlSync = ({ worldData }: UseUrlSyncProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (worldData && worldData.slug) {
      const expectedPath = `/experience/${worldData.slug}`;
      if (location.pathname !== expectedPath) {
        console.log('Updating URL to:', expectedPath);
        navigate(expectedPath, { replace: true });
      }
    }
  }, [worldData, location.pathname, navigate]);
};
