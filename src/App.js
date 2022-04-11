import _ from "lodash";
import { useState } from "react";
import { Plus } from "react-feather";
import {
  fetchPatients,
  fetchProcedures,
  fetchVolumes,
  generateQueryUrl,
} from "./fetchingUtils";
import FhirServerUrlInput from "./components/RequestForm/FhirServerUrlInput";
import PatientQueryList from "./components/RequestForm/PatientQueryList";
import DataView from "./components/DataView/DataView";
import Header from "./components/Header";
import LoadingAnimation from "./components/LoadingAnimation";
import RequestForm from "./components/RequestForm/RequestForm";

const {
  mapPatient,
  mapCourseSummary,
  mapPhase,
  mapVolumes,
} = require("./mappingUtils.js");

const BASE_URL = "https://api.logicahealth.org/RTTD/open";

function App() {
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState(BASE_URL);
  const [resourceMap, setResourceMap] = useState(new Map());
  const [searchedPatientIds, setSearchedPatientIds] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [currentPatientQuery, setCurrentPatientQuery] = useState({});
  const [currentPatientQueryIdx, setCurrentPatientQueryIdx] = useState();
  const [patientQueries, setPatientQueries] = useState([
    {
      id: "Patient-XRTS-01",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
    {
      id: "Patient-XRTS-03",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
  ]);

  function openRequestForm(queryIndex) {
    setCurrentPatientQueryIdx(queryIndex);
    setShowRequestForm(true);
  }

  /**
   * Creates a map with each patient Id as a key, and an array of corresponding resources as the value.
   * Logs the resulting map to the console
   */
  async function makeRequests() {
    const resourceMap = new Map();
    // Convert the query parameter objects into query urls
    const searchQueries = patientQueries.map((queryObj) =>
      generateQueryUrl(serverUrl, queryObj)
    );

    // Compact the return result to remove empty values
    const patientResources = await fetchPatients(searchQueries).then(
      (patients) => _.compact(patients)
    );
    for (const patient of patientResources) {
      const procedures = await fetchProcedures(serverUrl, patient.id);
      const volumes = await fetchVolumes(serverUrl, patient.id);
      resourceMap.set(patient.id, [
        mapPatient(patient),
        mapPhase(procedures),
        mapCourseSummary(procedures),
        mapVolumes(volumes),
      ]);
    }
    setSearchedPatientIds(patientResources.map((patient) => patient.id));
    setResourceMap(resourceMap);
  }

  return (
    <>
      <Header />
      <div className="container grid grid-cols-4 sm:mx-auto px-4 sm:px-0 mt-4">
        <div className="col-span-4 sm:col-span-1 mr-0 sm:mr-2 flex flex-col">
          {/* Input for the FHIR server URL */}
          <FhirServerUrlInput
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
          />
          <span className="flex text-base last:border-b-0 w-full justify-between items-center">
            <label className="text-lg mb-1" htmlFor="patientQueries">
              Patient Queries
            </label>
            <button
              type="button"
              className="flex"
              onClick={(e) => {
                openRequestForm(patientQueries.length);
              }}
            >
              <Plus className="inline m-2" size={24} />
            </button>
          </span>
          <PatientQueryList
            patientQueries={patientQueries}
            setPatientQueries={setPatientQueries}
            setCurrentPatientQuery={setCurrentPatientQuery}
            openRequestForm={openRequestForm}
          />
          <button
            className="my-4 p-2 border border-gray-400 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all shadow-lg active:shadow "
            onClick={async (e) => {
              setLoading(true);
              await makeRequests();
              setLoading(false);
            }}
          >
            Fetch Treatment Summaries
          </button>
        </div>
        <div className="col-span-4 sm:col-span-3 ml-0 sm:ml-2">
          {resourceMap && (
            <DataView
              resourceMap={resourceMap}
              key={searchedPatientIds}
              patientIds={searchedPatientIds}
            />
          )}
          {loading && <LoadingAnimation />}
        </div>
      </div>
      {showRequestForm && (
        <RequestForm
          currentPatientQuery={currentPatientQuery}
          setCurrentPatientQuery={setCurrentPatientQuery}
          patientQueries={patientQueries}
          setPatientQueries={setPatientQueries}
          display={showRequestForm}
          setDisplay={setShowRequestForm}
          currentPatientQueryIdx={currentPatientQueryIdx}
          setCurrentPatientQueryIdx={setCurrentPatientQueryIdx}
        />
      )}
    </>
  );
}

export default App;
