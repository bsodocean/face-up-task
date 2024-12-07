const port = 3000;
const localHost = `http://localhost${port}`;

// enum endpoints {
//   getAlertEntrys = "/api/alerts",
//   addAlertEntry = "/api/newAlert",
//   deleteAlertEntry = "/api/deleteAlert/",
//   updateAlertEntry = "/api/updateAlert/",
// }

const HttpService = {
  getAlerts: function () {
    fetch("http://localhost:3000/api/data/alerts")
      .then((response) => response.json)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  },
  addAlertEntry: function () {
    fetch("http://localhost:3000/api/data/newAlert")
      .then((response) => response.json)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  },

  editAlertEntry: function (
    name?: string,
    age?: number,
    description?: string,
    fileUrl?: string
  ) {
    fetch("http://localhost:3000/api/data/newAlert")
      .then((response) => response.json)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  },

  deleteAlertEntry: function (id: number) {},
};

export default HttpService;
