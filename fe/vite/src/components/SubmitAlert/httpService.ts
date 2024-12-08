const port = 3000;
const localHost = `http://localhost:${port}`;

enum Api {
  Get = "/api/alerts",
  Create = "/api/newAlert",
  Delete = "/api/deleteAlert/",
  Update = "/api/updateAlert/",
}

const fetchWithErrorHandling = async (
  url: string,
  options: RequestInit = {}
) => {
  try {
    const response = await fetch(url, options);

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Assuming JSON response, return parsed JSON data
    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};

const HttpService = {
  // Fetch alerts
  getAlerts: async () => {
    return await fetchWithErrorHandling(`${localHost}${Api.Get}`);
  },

  // Add a new alert
  addAlertEntry: async (
    id: string,
    name: string,
    age: number,
    description: string,
    fileUrl?: string
  ): Promise<void> => {
    const body = JSON.stringify({
      id,
      name,
      age,
      description,
      ...(fileUrl && { fileUrl }),
    });

    await fetchWithErrorHandling(`${localHost}${Api.Create}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  },

  // Edit an existing alert
  editAlertEntry: async (
    id: string,
    name?: string,
    age?: number,
    description?: string,
    fileUrl?: string
  ): Promise<void> => {
    const body = JSON.stringify({
      ...(name && { name }),
      ...(age && { age }),
      ...(description && { description }),
      ...(fileUrl && { fileUrl }),
    });

    await fetchWithErrorHandling(`${localHost}${Api.Update}${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  },

  // Delete an alert
  deleteAlertEntry: async (id: number): Promise<void> => {
    await fetchWithErrorHandling(`${localHost}${Api.Delete}${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default HttpService;
