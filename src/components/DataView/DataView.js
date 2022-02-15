import PatientTable from "./PatientTable";
import TreatmentVolumeTable from "./TreatmentVolumeTable";
import TreatmentPhaseTable from "./TreatmentPhaseTable";
import CourseSummaryTable from "./CourseSummaryTable";
import PatientSelect from "./PatientSelect";
import { useState } from "react";
import _ from "lodash";

/**
 * Parse and reformat patient data for visualization
 * @param {Object[]} data
 * @returns Patient data formatted for the PatientTable visualizer
 */
function getPatientData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[0];
}

/**
 * Parse and reformat treatment volume data for visualization
 * @param {Object[]} data
 * @returns Treatment volume data formatted for the CourseSummaryTable visualizer
 */
function getTreatmentVolumesData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[3];
}

/**
 * Parse and reformat phase data for visualization
 * @param {Object[]} data
 * @returns Phase data formatted for the TreatmentPhaseTable visualizer
 */
function getTreatmentPhaseData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[1];
}

/**
 * Parse and reformat course summary data for visualization
 * @param {Object[]} data
 * @returns Course summary data formatted for the CourseSummaryTable visualizer
 */
function getCourseSummaryData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[2];
}

function DataView({ resourceMap = {}, patientIds = [] }) {
  const [selectedPatientId, setSelectedPatientId] = useState(
    patientIds.length !== 0 && patientIds[0]
  );
  const patientData = getPatientData(selectedPatientId, resourceMap);
  const treatmentPhaseData = getTreatmentPhaseData(
    selectedPatientId,
    resourceMap
  );
  const treatmentVolumesData = getTreatmentVolumesData(
    selectedPatientId,
    resourceMap
  );
  const courseSummaryData = getCourseSummaryData(
    selectedPatientId,
    resourceMap
  );
  const hasPatientData =
    !_.isEmpty(patientData) ||
    !_.isEmpty(treatmentPhaseData) ||
    !_.isEmpty(treatmentVolumesData) ||
    !_.isEmpty(courseSummaryData);
  return (
    <>
      <PatientSelect
        options={patientIds}
        value={selectedPatientId}
        setValue={setSelectedPatientId}
      />
      {!hasPatientData && <p>No Patient Data found for {selectedPatientId}</p>}
      {hasPatientData && (
        <>
          <PatientTable className="my-4" data={patientData} />
          {/* NOTE: Not visualizing diagnosis tables now b/c of Michelle feedback*/}
          {/* <DiagnosisTable className="my-4" data={diagnosisData} /> */}
          <TreatmentVolumeTable className="my-4" data={treatmentVolumesData} />
          {treatmentPhaseData &&
            treatmentPhaseData.map((phase, i) => (
              <TreatmentPhaseTable
                key={phase["Start Date"]}
                data={phase}
                title={`Phase ${i + 1}`}
              />
            ))}
          <CourseSummaryTable className="my-4" data={courseSummaryData} />
        </>
      )}
    </>
  );
}

export default DataView;
