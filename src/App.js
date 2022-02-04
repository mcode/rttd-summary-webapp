import { useState } from "react";
import axios from "axios";
import DataView from "./components/DataView";
import Header from "./components/Header";
import LoadingAnimation from "./components/LoadingAnimation";

const {
  mapPatient,
  mapCourseSummary,
  mapPhase,
  mapVolumes,
} = require("./mappingUtils.js");

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
        console.error(e);
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
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return procedureResources;
}

/**
 * Takes a patient ID and fetches RTTD Volumes resources that patient
 * @param {String} patientId - A patient ID to fetch Procedure resources for
 * @returns {Object[]} Returns an array of FHIR BodyStructure resources for that Patient
 */
async function fetchVolumes(patientId) {
  // TODO: Determine why this is a body structure and
  //       if we need to filter out non-volume BodyStructure resources
  let volumeResources = await axios
    .get(`${baseURL}/BodyStructure?patient:Patient=${patientId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return volumeResources;
}

/**
 * Creates a map with each patient Id as a key, and an array of corresponding resources as the value.
 * Logs the resulting map to the console
 */
async function makeRequests() {
  const resourceMap = new Map();
  const patientResources = await fetchPatients([
    firstPatientId,
    secondPatientId,
  ]);
  for (const patient of patientResources) {
    const procedures = await fetchProcedures(patient.id);
    const volumes = await fetchVolumes(patient.id);
    resourceMap.set(patient.id, [
      mapPatient(patient),
      mapPhase(procedures),
      mapCourseSummary(procedures),
      mapVolumes(volumes),
    ]);
  }

  const patientIds = patientResources.map((patient) => patient.id);

  return [patientIds, resourceMap];
}

function App() {
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState();
  return (
    <>
      <Header />
      <div className="container sm:mx-auto px-4 sm:px-0">
        <button
          onClick={async () => {
            setLoading(true);
            const resp = await makeRequests();
            setLoading(false);
            setFetchedData(resp);
          }}
          className="my-4 p-2 border border-gray-400 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all shadow-lg active:shadow "
        >
          Fetch Treatment Summaries
        </button>
        {loading && <LoadingAnimation />}

        {fetchedData && <DataView data={fetchedData} />}
      </div>
    </>
  );
}

export default App;
