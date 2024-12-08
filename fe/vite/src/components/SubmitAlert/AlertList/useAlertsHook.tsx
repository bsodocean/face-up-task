import { useEffect, useState } from "react";
import HttpService from "../httpService";
import { Alert } from "../../../types";

const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alerts = await HttpService.getAlerts();
        console.log(alerts); // Handle the alerts data
        setAlerts(alerts);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, loading, error };
};

export default useAlerts;
