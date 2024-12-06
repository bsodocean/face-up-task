import { FC, useState, useEffect } from "react";
import SubmitAlert from "../SubmitAlert";
import "./AlertList.css";

interface Alert {
  id: number;
  name: string;
  age: number;
  description: string;
  file?: string | File | null;
}

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
    age: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    if (activeAlert) {
      setNewFormData({
        name: activeAlert.name,
        age: String(activeAlert.age),
        description: activeAlert.description,
        file: activeAlert.file ?? null, // ! This works, but the compiler has an issue with it ! //
      });
    }
  }, [activeAlert]);

  const toggleDetails = (id: number) => {
    const selectedAlert = alerts.find((alert) => alert.id === id);
    setActiveAlert((prevState) =>
      prevState?.id === id ? null : selectedAlert || null
    );
  };

  const closeModal = () => {
    setActiveAlert(null);
  };

  const addAlertEntry = (alert: Omit<Alert, "id">) => {
    const newAlert = { ...alert, id: Date.now() };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const editEntry = () => {
    setActiveEdit((prevState) => !prevState);
    if (activeAlert) {
      setActiveAlert({
        ...activeAlert,
        ...newFormData,
        age: Number(newFormData.age),
      });
    }
  };

  const deleteEntry = (entryId: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== entryId)
    );
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
                  {alert.file ? (
                    <a
                      href={
                        typeof alert.file === "string"
                          ? alert.file
                          : URL.createObjectURL(alert.file)
                      }
                    >
                      Download
                    </a>
                  ) : (
                    "No file"
                  )}
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
                    setNewFormData({ ...newFormData, age: e.target.value })
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
                  <a href={URL.createObjectURL(newFormData.file)}>Download</a>
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
                    <a
                      href={
                        typeof activeAlert.file === "string"
                          ? activeAlert.file
                          : activeAlert.file
                          ? URL.createObjectURL(activeAlert.file)
                          : "#"
                      }
                    >
                      Download
                    </a>
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
