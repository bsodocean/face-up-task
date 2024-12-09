import { useEffect, useState } from "react";
import { Alert } from "../../../types";
import HttpService from "../httpService";

const useAlerts = () => {
  const [fetchAlerts, setFectchedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const fetchAlerts = await HttpService.getAlerts();
        setFectchedAlerts(fetchAlerts);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { fetchAlerts, loading, error };
};

export default useAlerts;
