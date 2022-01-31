import logo from "./CodeXLogo.png";
import axios from "axios";
import "./App.css";

const fhirpath = require("fhirpath");

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
    .then((res) => res.data)
    .catch((e) => {
      console.log(e);
    });

  return procedureResources;
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
    resourceMap.set(patient.id, [patient, procedures]);
  }

  console.log(resourceMap);
  console.log(mapPatient(resourceMap.get("Patient-XRTS-01")[0]));
  console.log(mapCourseSummary(resourceMap.get("Patient-XRTS-01")[1]));
}

function mapPatient(patient) {
  let output = {};
  output["ID"] = patient.identifier[0].value;
  output["First Name"] = patient.name[0].given.join(" ");
  output["Last Name"] = patient.name[0].family;
  output["Date of Birth"] = patient.birthDate;
  output["Administrative Gender"] = patient.gender;
  output["Birth Sex"] = patient.extension[0].valueCode;
  return output;
}

function mapCourseSummary(procedure) {
  let summary = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.meta.profile.first() = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-course-summary').resource"
  )[0];
  let output = {};
  output["Course Label"] = summary.identifier[0].value;
  let intent = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent').valueCodeableConcept.coding"
  )[0];
  output["Treatment Intent"] = `SCT#${intent.code} "${intent.display}"`;
  output["Start Date"] = summary.performedPeriod.start;
  output["End Date"] = summary.performedPeriod.end;
  let modality = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding"
  )[0];
  output["Modalities"] = `SCT#${modality.code} "${modality.display}"`;
  let technique = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding"
  )[0];
  output["Techniques"] = `SCT#${technique.code} "${technique.display}"`;
  output["Number of Sessions"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-sessions').valueUnsignedInt"
  )[0];
  return output;
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
