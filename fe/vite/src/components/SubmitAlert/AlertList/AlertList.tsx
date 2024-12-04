import { FC, useState } from "react";
import "./AlertList.css";
import SubmitAlert from "../SubmitAlert";

interface Alert {
  id: number;
  name: string;
  age: number;
  file: string;
}

const AlertList: FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlertEntry = (alert: Omit<Alert, "id">) => {
    const newAlert = { ...alert, id: Date.now() }; //
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const editEntry = (entryId: number) => {
    // Implementation for editing an alert
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
      <table className='alert-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td>{alert.id}</td>
              <td>{alert.name}</td>
              <td>{alert.age}</td>
              <td>
                {alert.file ? <a href={alert.file}>Download</a> : "No file"}
              </td>
              <td>
                <button onClick={() => editEntry(alert.id)}>Edit</button>
                <button onClick={() => deleteEntry(alert.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertList;
