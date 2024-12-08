import { FC, useEffect, useState } from "react";
import { Alert } from "../../../types";
import HttpService from "../httpService";
import SubmitAlert from "../SubmitAlert";
import "./AlertList.css";

const AlertList: FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      name: "René Descartes",
      age: 23,
      id: 1142002,
      description: "I think, therefore I am.",
    },
    {
      name: "William Shakespear",
      age: 30,
      id: 2002411,
      description:
        "Be not afraid of greatness. Some are born great, some achieve greatness, and others have greatness thrust upon them.",
    },
  ]);

  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [activeEdit, setActiveEdit] = useState(false);
  const [newFormData, setNewFormData] = useState({
    name: "",
    age: 0,
    description: "",
    file: "",
  });

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
      setActiveAlert({
        ...activeAlert,
        ...newFormData, //
        age: newFormData.age,
      });
      HttpService.editAlertEntry(
        activeAlert.id.toString(),
        newFormData.name,
        Number(newFormData.age),
        newFormData.description
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
                  {alert.file ? <div>{alert.file.toString()}</div> : "No file"}
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
      )}
    </div>
  );
};

export default AlertList;
