import { useState } from "react";
import { Trash, Plus } from "react-feather";
import axios from "axios";
import DataView from "./components/DataView/DataView";
import Header from "./components/Header";
import LoadingAnimation from "./components/LoadingAnimation";
import FetchDataButton from "./components/RequestForm/FetchDataButton";

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
  const [serverUrl, setServerUrl] = useState(
    "https://api.logicahealth.org/RTTD/open"
  );
  const [patientIdInput, setPatientIdInput] = useState("");
  const [patientIds, setPatientIds] = useState([]);
  function addToPatientIds() {
    if (patientIdInput === "") return;
    setPatientIds([patientIdInput, ...patientIds]);
    setPatientIdInput("");
  }
  function removeIthPatientId(index) {
    if (index < 0 || index > patientIds.length) return;
    setPatientIds(
      patientIds
        .slice(0, index)
        .concat(patientIds.slice(index + 1, patientIds.length))
    );
  }
  const [fetchedData, setFetchedData] = useState();
  return (
    <>
      <Header />
      <div className="container sm:mx-auto px-4 sm:px-0">
        <form
          className="flex flex-col mt-4 max-w-md"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const resp = await makeRequests();
            setLoading(false);
            setFetchedData(resp);
          }}
        >
          {/* Input for the FHIR server URL */}
          <label className="text-lg italic mb-1" htmlFor="serverUrl">
            FHIR Server URL
          </label>
          <input
            type="url"
            id="serverUrl"
            name="serverUrl"
            placeholder="https://api.logicahealth.org/RTTD/open"
            pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)"
            className="border border-slate-500 mb-4 p-2"
            value={serverUrl}
            onChange={(e) => {
              const value = e.target.value;
              console.log(value);
              setServerUrl(value);
            }}
          />
          {/* Input component for entering a list of patient ids */}
          <div id="patient-ids-section " className="mb-4">
            <label className="text-lg italic mb-1" htmlFor="patientIds">
              Patient IDs
            </label>
            <div id="id-input-row" className="flex rounded-t-lg mb-4">
              <input
                type="text"
                id="patientIds"
                name="patientIds"
                placeholder="e.g. PatientMrn123"
                className="border border-slate-500 p-2 w-10/12"
                value={patientIdInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setPatientIdInput(value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // Avoid triggering the submit logic
                    e.preventDefault();
                    addToPatientIds();
                  }
                }}
              />
              <button
                type="button"
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  addToPatientIds();
                }}
              >
                <Plus className="inline m-2" size={24} />
              </button>
            </div>
            {patientIds.length > 0 && (
              <ul className="max-h-72 overflow-y-auto border border-slate-500 ">
                {patientIds.map((id, i) => {
                  return (
                    <li
                      className="flex text-base border-b last:border-b-0 border-slate-500 w-full p-2 justify-between items-center"
                      key={i}
                    >
                      {id}
                      <button
                        type="button"
                        className="flex"
                        onClick={(e) => {
                          e.preventDefault();
                          removeIthPatientId(i);
                        }}
                      >
                        <Trash className="inline" size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <FetchDataButton />
        </form>
        {loading && <LoadingAnimation />}
        {fetchedData && <DataView data={fetchedData} />}
      </div>
    </>
  );
}

export default App;
