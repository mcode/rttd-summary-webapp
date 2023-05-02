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
import ErrorAlert from "../ErrorAlert";

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
  const [error, setError] = useState();
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

  function fadingSuccess(msg) {
    setAlert(msg);
    setTimeout(() => {
      setAlert(undefined);
    }, 6000);
  }

  function fadingError(msg) {
    setError(msg);
    setTimeout(() => {
      setError(undefined);
    }, 6000);
  }

  function validConfig(config) {
    // To start, validation will be a simple check that the keys on our object are as expected
    const configKeys = new Set(Object.keys(config));
    return (
      configKeys.has("requestHeaders") &&
      configKeys.has("serverUrl") &&
      configKeys.has("patientQueries") &&
      configKeys.has("includeMetadata")
    );
  }

  // Parse configuration data and update state with the provided data, triggering a success alert
  function parseConfigSetState(configData, fileName) {
    const config = JSON.parse(configData);
    console.log(config);

    if (validConfig(config)) {
      setRequestHeaders(config.requestHeaders);
      setServerUrl(config.serverUrl);
      setPatientQueries(config.patientQueries);
      setIncludeMetadata(config.includeMetadata);
      fadingSuccess(`Loaded config '${fileName}'`);
    } else {
      fadingError("Invalid config file cannot be loaded");
    }
  }

  // Load request configuration data from a file into state
  function loadFile(file) {
    try {
      const fileReader = new FileReader();
      // When the file is done, parse the config and update state
      fileReader.onload = (e) =>
        parseConfigSetState(e.target.result, file.name);
      //  Handle errors with a fadingError alert
      fileReader.onerror = () =>
        fadingError(
          `Encountered error when loading config; ensure it's a properly formatted json file`
        );
      fileReader.readAsText(file);
    } catch (err) {
      // Catch any unexpected errors
      console.error(err);
      fadingError(
        `Failed to load config; ensure it's a properly formatted json file`
      );
    }
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
    // Create a somewhat-unique file name based on the current day
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
    // Remove the anchor to avoid memory leaks
    a.remove();
    // Trigger a success alert when finished
    fadingSuccess(`Downloaded current configuration to ${fileName}`);
  }

  return (
    <>
      <div className="col-span-4 md:col-span-1 mr-0 md:mr-2 flex flex-col md:h-screen space-y-2 ">
        {/* Heading with upload/download buttons  */}
        <div
          id="heading-action-panel"
          className="flex flex-col justify-between space-y-2"
        >
          <h1 className="text-lg italic">Request Configuration Settings</h1>
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
              onChange={(event) => {
                loadFile(event.target.files[0]);
                event.target.value = null;
              }}
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
        {error && <ErrorAlert>{error}</ErrorAlert>}
      </div>
    </>
  );
}
