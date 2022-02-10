import _ from "lodash";
import { useState } from "react";
import { fetchPatients, fetchProcedures, fetchVolumes } from "./fetchingUtils";
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
const PATIENT_IDS = ["Patient-XRTS-01", "Patient-XRTS-03"];

function App() {
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState(BASE_URL);
  const [patientIdInput, setPatientIdInput] = useState("");
  const [patientIds, setPatientIds] = useState(PATIENT_IDS);
  const [resourceMap, setResourceMap] = useState(new Map());
  const [searchedPatientIds, setSearchedPatientIds] = useState([]);

  /**
   * Creates a map with each patient Id as a key, and an array of corresponding resources as the value.
   * Logs the resulting map to the console
   */
  async function makeRequests() {
    const resourceMap = new Map();
    // Compact the return result to remove empty values
    const patientResources = await fetchPatients(serverUrl, patientIds).then(
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
    setSearchedPatientIds(patientIds);
    setResourceMap(resourceMap);
  }

  return (
    <>
      <Header />
      <div className="container grid grid-cols-4 sm:mx-auto px-4 sm:px-0 mt-4">
        <div className="col-span-4 sm:col-span-1 mr-0 sm:mr-2">
          <RequestForm
            makeRequests={makeRequests}
            setLoading={setLoading}
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
            patientIdInput={patientIdInput}
            setPatientIdInput={setPatientIdInput}
            patientIds={patientIds}
            setPatientIds={setPatientIds}
            setResourceMap={setResourceMap}
            setSearchedPatientIds={setSearchedPatientIds}
          />
        </div>
        <div className="col-span-4 sm:col-span-3 ml-0 sm:ml-2">
          {loading && <LoadingAnimation />}
          {resourceMap && (
            <DataView
              resourceMap={resourceMap}
              key={searchedPatientIds}
              patientIds={searchedPatientIds}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
