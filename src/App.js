import logo from "./CodeXLogo.png";
import axios from "axios";
import "./App.css";

const baseURL = "https://api.logicahealth.org/RTTD/open";
const firstPatientId = "Patient-XRTS-01";
const secondPatientId = "Patient-XRTS-03";

/**
 * Takes an array of patient IDs and fetches FHIR resources for each of them
 * @param {String[]} patientIdArray - An array of patient Ids to fetch resources for
 * @returns {Object[]} Returns an array of FHIR patient resources
 */
async function fetchPatients(patientIdArray) {
  let patientResourceArray = [];

  for (const patientId of patientIdArray) {
    let patientResource = await axios
      .get(`${baseURL}/Patient?_id=${patientId}`)
      .then((res) => res.data.entry[0].resource)
      .catch((e) => {
        console.log(e);
      });
    patientResourceArray.push(patientResource);
  }

  return patientResourceArray;
}

/**
 * Takes a patient ID and fetches RTTD Procedure resources that patient
 * @param {String} patientId - A patient ID to fetch Procedure resources for
 * @returns {Object[]} Returns an array of FHIR Procedure resources for that Patient
 */
async function fetchProcedures(patientId) {
  let procedureResources = await axios
    .get(`${baseURL}/Procedure?subject:Patient=${patientId}`)
    .then((res) => res.data.entry)
    .catch((e) => {
      console.log(e);
    });

  return procedureResources.map((entryItem) => entryItem.resource);
}

/**
 * Creates a map with each patient Id as a key, and an array of corresponding resources as the value.
 * Logs the resulting map to the console
 */
async function makeRequests() {
  let resourceMap = new Map();
  let patientResources = await fetchPatients([firstPatientId, secondPatientId]);

  for (const patient of patientResources) {
    const procedures = await fetchProcedures(patient.id);
    resourceMap.set(patient.id, [patient, ...procedures]);
  }

  console.log(resourceMap);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Radiotherapy Treatment Demo App</p>
      </header>
      <button onClick={makeRequests} className="request-button">
        Fetch Treatment Summaries
      </button>
      <img justify-content="center" src={logo} className="center" alt="logo" />
    </div>
  );
}

export default App;
