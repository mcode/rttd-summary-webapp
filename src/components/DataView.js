import PatientTable from "./PatientTable";
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
  console.log(data[2]);
  return data[2];
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
  return data[1];
}

function DataView({ data }) {
  const patientData = getPatientData(data);
  const treatmentPhaseData = getTreatmentPhaseData(data);
  const treatmentVolumesData = getTreatmentVolumesData(data);
  const courseSummaryData = getCourseSummaryData(data);
  return (
    <div>
      <PatientTable className="m-4" data={patientData} />
      <TreatmentVolumeTable className="m-4" data={treatmentPhaseData} />
      <TreatmentPhaseTable className="m-4" data={treatmentVolumesData} />
      <CourseSummaryTable className="m-4" data={courseSummaryData} />
    </div>
  );
}

export default DataView;
