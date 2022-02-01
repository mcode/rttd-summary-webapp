import { v4 } from "uuid";
import PatientTable from "./PatientTable";
import DiagnosisTable from "./DiagnosisTable";
import TreatmentVolumeTable from "./TreatmentVolumeTable";
import TreatmentPhaseTable from "./TreatmentPhaseTable";
import CourseSummaryTable from "./CourseSummaryTable";

/**
 * Parse and reformat patient data for visualization
 * @param {Object[]} data
 * @returns Patient data formatted for the PatientTable visualizer
 */
function getPatientData(data) {
  return data[0];
}

/**
 * Parse and reformat treatment volume data for visualization
 * @param {Object[]} data
 * @returns Treatment volume data formatted for the CourseSummaryTable visualizer
 */
function getTreatmentVolumesData(data) {
  return data[3].entry.map((vol) => ({
    "Volume Label": "Prostate",
    // UID: "{assigned by provider}",
    UID: v4(),
    "Type (*1)": 'SCT#228793007 "Planning target volume (observable entity)"',
    "Location Code": 'SCT#41216001 "Prostatic structure (body structure)" ',
    "Location Qualifier Code": 'SCT#255503000 "Entire (qualifier value)"',
    "Laterality Qualifier Code": "n/a",
  }));
}

/**
 * Parse and reformat diagnosis data for visualization
 * @param {Object[]} data
 * @returns Diagnosis data formatted for the DiagnosisTable visualizer
 */
function getDiagnosisData(data) {
  return undefined;
  // return data[1];
}

/**
 * Parse and reformat phase data for visualization
 * @param {Object[]} data
 * @returns Phase data formatted for the TreatmentPhaseTable visualizer
 */
function getTreatmentPhaseData(data) {
  return data[1];
}

/**
 * Parse and reformat course summary data for visualization
 * @param {Object[]} data
 * @returns Course summary data formatted for the CourseSummaryTable visualizer
 */
function getCourseSummaryData(data) {
  return data[2];
}

function DataView({ data }) {
  const patientData = getPatientData(data);
  const diagnosisData = getDiagnosisData(data);
  const treatmentPhaseData = getTreatmentPhaseData(data);
  const treatmentVolumesData = getTreatmentVolumesData(data);
  const courseSummaryData = getCourseSummaryData(data);
  return (
    <div>
      <PatientTable className="m-4" data={patientData} />
      {/* NOTE: Not visualizing diagnosis tables now b/c of Michelle feedback*/}
      {/* <DiagnosisTable className="m-4" data={diagnosisData} /> */}
      <TreatmentVolumeTable className="m-4" data={treatmentVolumesData} />
      {treatmentPhaseData.map((phase, i) => (
        <TreatmentPhaseTable
          key={phase["Start Date"]}
          className="m-4"
          data={phase}
          title={`Phase ${i + 1}`}
        />
      ))}
      <CourseSummaryTable className="m-4" data={courseSummaryData} />
    </div>
  );
}

export default DataView;
