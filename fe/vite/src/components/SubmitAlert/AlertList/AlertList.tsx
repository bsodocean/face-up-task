import { FC, useEffect, useState } from "react";
import { Alert } from "../../../types";
import HttpService from "../httpService";
import SubmitAlert from "../SubmitAlert";
import "./AlertList.css";
import useAlerts from "./useAlertsHook";

const AlertList: FC = () => {
  const { fetchAlerts, loading, error } = useAlerts();
  const [alerts, setAlerts] = useState<Alert[]>(fetchAlerts);
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [activeEdit, setActiveEdit] = useState(false);
  const [newFormData, setNewFormData] = useState({
    name: "",
    age: 0,
    description: "",
    file: "",
  });

  useEffect(() => {
    setAlerts(fetchAlerts);
  }, [fetchAlerts]);

  useEffect(() => {
    if (activeAlert) {
      setNewFormData({
        name: activeAlert.name,
        age: activeAlert.age,
        description: activeAlert.description,
        file: activeAlert.file as string,
      });
    }
  }, [activeAlert]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading alerts: {error}</div>;

  const toggleDetails = (id: number) => {
    const selectedAlert = alerts.find((alert) => alert.id === id);
    setActiveAlert((prevState) =>
      prevState?.id === id ? null : selectedAlert || null
    );
    HttpService.getAlerts();
  };

  const closeModal = () => {
    setActiveAlert(null);
  };

  const addAlertEntry = (alert: Omit<Alert, "id">) => {
    const newAlert = { ...alert, id: Date.now() };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    HttpService.addAlertEntry(
      newAlert.id.toString(),
      newAlert.name,
      newAlert.age,
      newAlert.description
    );
  };

  const editEntry = () => {
    setActiveEdit((prevState) => !prevState);

    if (activeAlert) {
      const updatedAlert = {
        ...activeAlert,
        ...newFormData,
        age: newFormData.age, // Make sure age is updated correctly
      };

      // Update state with the new alert in the list
      setActiveAlert(updatedAlert);
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === updatedAlert.id ? updatedAlert : alert
        )
      );

      // Send the updated data to the backend
      HttpService.editAlertEntry(
        updatedAlert.id.toString(),
        updatedAlert.name,
        updatedAlert.age,
        updatedAlert.description
      );
    }
  };

  const deleteEntry = (entryId: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== entryId)
    );
    HttpService.deleteAlertEntry(entryId);
    closeModal();
  };

  return (
    <div className='alert-table-container'>
      <h2>Alert List</h2>
      <SubmitAlert addAlertEntry={addAlertEntry} />
      {alerts.length > 0 ? (
        <table className='alert-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>File</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.id}</td>
                <td>{alert.name}</td>
                <td>{alert.age}</td>
                <td>
                  {alert.file ? <a>{alert.file.toString()}</a> : "No file"}
                </td>
                <td>
                  <button onClick={() => toggleDetails(alert.id)}>
                    {activeAlert?.id === alert.id
                      ? "Hide Details"
                      : "Show Details"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You're up to date!</p>
      )}

      {activeAlert && activeAlert && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <button className='close-button' onClick={closeModal}>
              X
            </button>
            {activeEdit ? (
              <>
                <h2>Details for Alert {activeAlert.id}</h2>
                <strong>Name:</strong>
                <input
                  type='text'
                  value={newFormData.name}
                  onChange={(e) =>
                    setNewFormData({ ...newFormData, name: e.target.value })
                  }
                />
                <strong>Age:</strong>
                <input
                  type='text'
                  value={newFormData.age}
                  onChange={(e) =>
                    setNewFormData({
                      ...newFormData,
                      age: Number(e.target.value),
                    })
                  }
                />
                <strong>Description:</strong>
                <input
                  type='text'
                  value={newFormData.description}
                  onChange={(e) =>
                    setNewFormData({
                      ...newFormData,
                      description: e.target.value,
                    })
                  }
                />
                <strong>File:</strong>
                {newFormData.file ? (
                  <a href={newFormData.file}>Download</a>
                ) : (
                  "No file"
                )}
              </>
            ) : (
              <>
                <h2>Details for Alert {activeAlert.id}</h2>
                <p>
                  <strong>Name:</strong> {activeAlert.name}
                </p>
                <p>
                  <strong>Age:</strong> {activeAlert.age}
                </p>
                <p>
                  <strong>Description:</strong> {activeAlert.description}
                </p>
                <p>
                  <strong>File:</strong>{" "}
                  {activeAlert.file ? (
                    <a href={activeAlert.file.toString()}>Download</a>
                  ) : (
                    "No file"
                  )}
                </p>
              </>
            )}
            <div className='btns'>
              <button className='edit-btn' onClick={editEntry}>
                Edit
              </button>
              <button
                className='delete-btn'
                onClick={() => deleteEntry(activeAlert.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertList;
