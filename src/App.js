import _ from "lodash";
import { useState } from "react";
import { Plus } from "react-feather";
import {
  fetchPatients,
  fetchProcedures,
  fetchServiceRequests,
  fetchVolumes,
  generateQueryUrl,
} from "./lib/fetchingUtils";
import {
  mapPatient,
  mapCourseSummary,
  mapTreatedPhase,
  mapPlannedTreatmentPhases,
  mapVolumes,
  mapPlannedCourses,
} from "./lib/mappingUtils";
import FhirServerUrlInput from "./components/RequestForm/FhirServerUrlInput";
import PatientQueryList from "./components/RequestForm/PatientQueryList";
import DataView from "./components/DataView/DataView";
import Header from "./components/Header";
import LoadingAnimation from "./components/LoadingAnimation";
import RequestForm from "./components/RequestForm/RequestForm";
import HeaderForm from "./components/HeaderForm/HeaderForm";
import RequestHeadersList from "./components/HeaderForm/RequestHeadersList";

const BASE_URL = "https://api.logicahealth.org/RTTD/open";

function App() {
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState(BASE_URL);
  const [resourceMap, setResourceMap] = useState(new Map());
  const [searchedPatientIds, setSearchedPatientIds] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [requestHeaders, setRequestHeaders] = useState([
    ["", ""],
    ["", ""],
    ["", ""],
  ]);
  const [currentPatientQuery, setCurrentPatientQuery] = useState({});
  const [currentPatientQueryIdx, setCurrentPatientQueryIdx] = useState();
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [patientQueries, setPatientQueries] = useState([
    {
      id: "Patient-XRTS-01-22A",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
    {
      id: "Patient-XRTS-02-22A",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
    {
      id: "Patient-XRTS-03-22A",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
    {
      id: "Patient-XRTS-04-22A",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
    {
      id: "Patient-XRTS-05-22A",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
    {
      id: "Patient-XRTS-01",
      givenName: "",
      familyName: "",
      birthDate: "",
      gender: "",
    },
    {
      id: "Patient-XRTS-02",
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

  function openHeaderForm() {
    setShowHeaderForm(true);
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
          <div key="metadata" className="space-x-1">
            <input type="checkbox" onChange={toggleMetadata} />
            <label>Include Metadata?</label>
          </div>
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
      {showHeaderForm && (
        <HeaderForm
          requestHeaders={requestHeaders}
          setRequestHeaders={setRequestHeaders}
          setDisplay={setShowHeaderForm}
        />
      )}
    </>
  );
}

export default App;
