import _ from "lodash";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
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
import BasicButton from "../BasicButton";
import SuccessAlert from "../SuccessAlert";

// GLOBALS
const BASE_URL = "https://api.logicahealth.org/RTTD/open";

export default function RequestConfigurationPanel({
  setResourceMap,
  setSearchedPatientIds,
  setLoading,
}) {
  const [alertContainer] = useAutoAnimate();
  // Basic state
  const [showPatientQueryForm, setShowPatientQueryForm] = useState(false);
  const [showRequestHeaderForm, setShowRequestHeaderForm] = useState(false);
  const [currentPatientQuery, setCurrentPatientQuery] = useState({});
  const [currentPatientQueryIdx, setCurrentPatientQueryIdx] = useState();
  const [alert, setAlert] = useState();
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

  function fadingAlert(msg) {
    setAlert(msg);
    setTimeout(() => {
      setAlert(undefined);
    }, 6000);
  }

  function parseConfigSetState(configData, fileName) {
    const config = JSON.parse(configData);
    console.log(config);
    setRequestHeaders(config.requestHeaders);
    setServerUrl(config.serverUrl);
    setPatientQueries(config.patientQueries);
    setIncludeMetadata(config.includeMetadata);
    fadingAlert(`Loaded config '${fileName}'`);
  }

  function loadFile(file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => parseConfigSetState(e.target.result, file.name);
    fileReader.readAsText(file);
  }

  async function downloadConfiguration(e) {
    e.preventDefault();
    const data = {
      requestHeaders,
      serverUrl,
      patientQueries,
      includeMetadata,
    };
    // Create a blob with the data we want to download as a file
    const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    const today = new Date();
    const fileName = `rttd-configuration-${[
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
    ].join("-")}.json`;
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
    fadingAlert(`Downloaded current configuration to ${fileName}`);
  }

  return (
    <>
      <div className="col-span-4 md:col-span-1 mr-0 md:mr-2 flex flex-col md:h-screen space-y-2 ">
        {/* Heading with upload/doownload buttons  */}
        <div
          id="heading-action-panel"
          className="flex flex-col justify-between space-y-2"
        >
          <h1 className="text-lg ">Settings Panel</h1>
          <div id="action-btn-container" className="flex space-x-2 text-sm">
            <label
              htmlFor="uploadInput"
              className="text-sm flex items-center text-center my-0 p-2 border border-gray-400 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-200 cursor-pointer disabled:cursor-not-allowed transition-all shadow-lg active:shadow"
            >
              <Upload size={16} className="mr-1" />
              Upload Settings
            </label>
            <input
              id="uploadInput"
              type="file"
              className="hidden"
              accept=".json"
              onChange={(event) => loadFile(event.target.files[0])}
            />
            <BasicButton
              className="my-0 flex items-center"
              onClick={downloadConfiguration}
            >
              <Download size={16} className="mr-1" />
              Save Settings
            </BasicButton>
          </div>
        </div>
        {/* Input for the FHIR server URL */}
        <div id="server-url-container">
          <FhirServerUrlInput
            serverUrl={serverUrl}
            setServerUrl={setServerUrl}
          />
        </div>
        {/* Request Headers  */}
        <div id="request-headers-container">
          <span className="flex text-base last:border-b-0 w-full justify-between items-center mb-1">
            <label className="text-lg" htmlFor="patientQueries">
              Request Headers
            </label>
            <button
              type="button"
              className="flex"
              onClick={(e) => {
                openHeaderForm([]);
              }}
            >
              <Plus className="inline m-2" size={20} />
            </button>
          </span>
          {requestHeaders.some((header) => header[0] && header[1]) ? (
            <RequestHeadersList
              requestHeaders={requestHeaders}
              setRequestHeaders={setRequestHeaders}
              openHeaderForm={openHeaderForm}
            />
          ) : (
            <p className="text-md italic">No request headers</p>
          )}
        </div>
        {/* Patient Queries */}
        <div id="patient-queries-container">
          <span className="flex text-base last:border-b-0 w-full justify-between items-center mb-1">
            <label className="text-lg" htmlFor="patientQueries">
              Patient Queries
            </label>
            <button
              type="button"
              className="flex"
              onClick={(e) => {
                openRequestForm(patientQueries.length);
              }}
            >
              <Plus className="inline m-2" size={20} />
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
        </div>
        {/* Metadata toggle */}
        <div id="metadata-container" className="space-x-1">
          <input
            id="metadata-toggle"
            type="checkbox"
            checked={includeMetadata}
            onChange={toggleMetadata}
          />
          <label htmlFor="metadata-toggle">Include Metadata?</label>
        </div>
        {/* Make Requests */}
        <BasicButton
          onClick={async (e) => {
            setLoading(true);
            await makeRequests();
            setLoading(false);
          }}
          disabled={patientQueries.length === 0}
        >
          Fetch Treatment Summaries
        </BasicButton>
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
      <div
        id="alert-container"
        ref={alertContainer}
        className={`absolute bottom-4 left-4 h-16`}
      >
        {alert && <SuccessAlert>{alert}</SuccessAlert>}
      </div>
    </>
  );
}
