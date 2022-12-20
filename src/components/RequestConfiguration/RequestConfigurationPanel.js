import _ from "lodash";
import { useState } from "react";
import { Download, Plus, Upload } from "react-feather";
// utils
import {
  fetchPatients,
  fetchProcedures,
  fetchServiceRequests,
  fetchVolumes,
  generateQueryUrl,
} from "../../lib/fetchingUtils";
import {
  mapPatient,
  mapCourseSummary,
  mapTreatedPhase,
  mapPlannedTreatmentPhases,
  mapVolumes,
  mapPlannedCourses,
} from "../../lib/mappingUtils";
// hooks
import useLocalStorage from "../../hooks/useLocalStorage";
// components
import FhirServerUrlInput from "./FhirServerUrlInput";
import PatientQueryForm from "./PatientQueryForm";
import PatientQueryList from "./PatientQueryList";
import RequestHeaderForm from "./RequestHeaderForm";
import RequestHeadersList from "./RequestHeadersList";

// GLOBALS
const BASE_URL = "https://api.logicahealth.org/RTTD/open";

export default function RequestConfigurationPanel({
  setResourceMap,
  setSearchedPatientIds,
  setLoading,
}) {
  // Basic state
  const [showPatientQueryForm, setShowPatientQueryForm] = useState(false);
  const [showRequestHeaderForm, setShowRequestHeaderForm] = useState(false);
  const [currentPatientQuery, setCurrentPatientQuery] = useState({});
  const [currentPatientQueryIdx, setCurrentPatientQueryIdx] = useState();
  // Local storage driven data
  const [requestHeaders, setRequestHeaders] = useLocalStorage(
    "requestHeaders",
    [
      ["", ""],
      ["", ""],
      ["", ""],
    ]
  );
  const [serverUrl, setServerUrl] = useLocalStorage("serverUrl", BASE_URL);
  const [patientQueries, setPatientQueries] = useLocalStorage(
    "patientQueries",
    [
      {
        id: "Patient-XRTS-01-22A",
        identifier: "",
        system: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: "",
      },
      {
        id: "Patient-XRTS-02-22A",
        identifier: "",
        system: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: "",
      },
      {
        id: "Patient-XRTS-03-22A",
        identifier: "",
        system: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: "",
      },
      {
        id: "Patient-XRTS-04-22A",
        identifier: "",
        system: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: "",
      },
      {
        id: "Patient-XRTS-05-22A",
        identifier: "",
        system: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: "",
      },
      {
        id: "Patient-XRTS-01",
        identifier: "",
        system: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: "",
      },
      {
        id: "Patient-XRTS-02",
        identifier: "",
        system: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: "",
      },
    ]
  );
  const [includeMetadata, setIncludeMetadata] = useLocalStorage(
    "includeMetadata",
    false
  );

  function openRequestForm(queryIndex) {
    setCurrentPatientQueryIdx(queryIndex);
    setShowPatientQueryForm(true);
  }

  function openHeaderForm() {
    setShowRequestHeaderForm(true);
  }

  function toggleMetadata() {
    setIncludeMetadata(!includeMetadata);
  }

  function createHeaderObj() {
    const headerObj = {};
    requestHeaders.forEach(([key, value]) => {
      if (key && value) {
        headerObj[key] = value;
      }
    });

    return headerObj;
  }

  /**
   * Creates a map with each patient Id as a key, and an array of corresponding resources as the value.
   * Logs the resulting map to the console
   */
  async function makeRequests() {
    const resourceMap = new Map();
    const headerObj = createHeaderObj();
    // Convert the query parameter objects into query urls
    const searchQueries = patientQueries.map((queryObj) =>
      generateQueryUrl(serverUrl, queryObj)
    );

    // Compact the return result to remove empty values
    const patientResources = await fetchPatients(searchQueries, headerObj).then(
      (patients) => _.compact(patients)
    );
    for (const patient of patientResources) {
      const procedures = await fetchProcedures(
        serverUrl,
        patient.id,
        headerObj
      );
      const volumes = await fetchVolumes(serverUrl, patient.id, headerObj);
      const serviceRequests = await fetchServiceRequests(
        serverUrl,
        patient.id,
        headerObj
      );
      resourceMap.set(patient.id, [
        mapPatient(patient, includeMetadata),
        mapTreatedPhase(procedures, includeMetadata),
        mapCourseSummary(procedures, includeMetadata),
        mapVolumes(volumes, includeMetadata),
        mapPlannedCourses(serviceRequests, includeMetadata),
        mapPlannedTreatmentPhases(serviceRequests, includeMetadata),
      ]);
    }
    setSearchedPatientIds(patientResources.map((patient) => patient.id));
    setResourceMap(resourceMap);
  }

  async function uploadConfiguration() {}

  async function downloadConfiguration() {}

  return (
    <>
      <div className="col-span-4 sm:col-span-1 mr-0 sm:mr-2 flex flex-col ">
        <div
          id="heading-action-panel"
          className="flex justify-between items-center"
        >
          <h1 className="text-sm">Request Configuration Panel</h1>
          <div id="action-btn-container" className="flex">
            <input id="uploadInput" type="file" hidden />
            <label
              htmlFor="uploadInput"
              className="rounded-full bg-slate-500 p-4"
            >
              <Upload size="16" />
            </label>
            <button onClick={downloadConfiguration}>
              <Download size="16" />
            </button>
          </div>
        </div>
        {/* Input for the FHIR server URL */}
        <FhirServerUrlInput serverUrl={serverUrl} setServerUrl={setServerUrl} />
        {/* Request Headers  */}
        <span className="flex text-base last:border-b-0 w-full justify-between items-center">
          <label className="text-lg mb-1" htmlFor="patientQueries">
            Request Headers
          </label>
          <button
            type="button"
            className="flex"
            onClick={(e) => {
              openHeaderForm([]);
            }}
          >
            <Plus className="inline m-2" size={24} />
          </button>
        </span>
        {requestHeaders.some((header) => header[0] && header[1]) ? (
          <RequestHeadersList
            requestHeaders={requestHeaders}
            setRequestHeaders={setRequestHeaders}
            openHeaderForm={openHeaderForm}
          />
        ) : (
          <p className="text-md text-center italic">No request headers</p>
        )}
        {/* Patient Queries */}
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
        {patientQueries.length > 0 ? (
          <PatientQueryList
            patientQueries={patientQueries}
            setPatientQueries={setPatientQueries}
            setCurrentPatientQuery={setCurrentPatientQuery}
            openRequestForm={openRequestForm}
            id="patientQueries"
          />
        ) : (
          <p className="text-md text-center italic">
            Please create a patient query
          </p>
        )}
        {/* Metadata toggle */}
        <div key="metadata" className="space-x-1">
          <input
            id="metadata-toggle"
            type="checkbox"
            checked={includeMetadata}
            onChange={toggleMetadata}
          />
          <label htmlFor="metadata-toggle">Include Metadata?</label>
        </div>
        {/* Make Requests */}
        <button
          className="my-4 p-2 border border-gray-400 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-200 cursor-pointer disabled:cursor-not-allowed transition-all shadow-lg active:shadow "
          onClick={async (e) => {
            setLoading(true);
            await makeRequests();
            setLoading(false);
          }}
          disabled={patientQueries.length === 0}
        >
          Fetch Treatment Summaries
        </button>
      </div>
      {/* Patient Query Modal */}
      {showPatientQueryForm && (
        <PatientQueryForm
          currentPatientQuery={currentPatientQuery}
          setCurrentPatientQuery={setCurrentPatientQuery}
          patientQueries={patientQueries}
          setPatientQueries={setPatientQueries}
          display={showPatientQueryForm}
          setDisplay={setShowPatientQueryForm}
          currentPatientQueryIdx={currentPatientQueryIdx}
          setCurrentPatientQueryIdx={setCurrentPatientQueryIdx}
        />
      )}
      {/* Request Header Modal */}
      {showRequestHeaderForm && (
        <RequestHeaderForm
          requestHeaders={requestHeaders}
          setRequestHeaders={setRequestHeaders}
          setDisplay={setShowRequestHeaderForm}
        />
      )}
    </>
  );
}
