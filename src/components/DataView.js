import PatientTable from "./PatientTable";
import TreatmentVolumeTable from "./TreatmentVolumeTable";
import TreatmentPhaseTable from "./TreatmentPhaseTable";
import CourseSummaryTable from "./CourseSummaryTable";
import PatientSelect from "./PatientSelect";
import { useState } from "react";

/**
 * Parse and reformat patient data for visualization
 * @param {Object[]} data
 * @returns Patient data formatted for the PatientTable visualizer
 */
function getPatientData(selectedPatientId, resourceMap) {
  return resourceMap.get(selectedPatientId)[0];
}

/**
 * Parse and reformat treatment volume data for visualization
 * @param {Object[]} data
 * @returns Treatment volume data formatted for the CourseSummaryTable visualizer
 */
function getTreatmentVolumesData(selectedPatientId, resourceMap) {
  return resourceMap.get(selectedPatientId)[3];
}

/**
 * Parse and reformat phase data for visualization
 * @param {Object[]} data
 * @returns Phase data formatted for the TreatmentPhaseTable visualizer
 */
function getTreatmentPhaseData(selectedPatientId, resourceMap) {
  return resourceMap.get(selectedPatientId)[1];
}

/**
 * Parse and reformat course summary data for visualization
 * @param {Object[]} data
 * @returns Course summary data formatted for the CourseSummaryTable visualizer
 */
function getCourseSummaryData(selectedPatientId, resourceMap) {
  return resourceMap.get(selectedPatientId)[2];
}

function DataView({ data }) {
  const [patientsIds, resourceMap] = data;
  console.log(data);
  console.log(patientsIds);
  console.log(resourceMap);
  const [selectedPatientId, setSelectedPatientId] = useState(
    patientsIds.length !== 0 && patientsIds[0]
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
  return (
    <div className="container sm:mx-auto mx-4">
      <PatientSelect
        options={patientsIds}
        value={selectedPatientId}
        setValue={setSelectedPatientId}
      />
      <PatientTable className="my-4" data={patientData} />
      {/* NOTE: Not visualizing diagnosis tables now b/c of Michelle feedback*/}
      {/* <DiagnosisTable className="my-4" data={diagnosisData} /> */}
      <TreatmentVolumeTable className="my-4" data={treatmentVolumesData} />
      {treatmentPhaseData.map((phase, i) => (
        <TreatmentPhaseTable
          key={phase["Start Date"]}
          data={phase}
          title={`Phase ${i + 1}`}
        />
      ))}
      <CourseSummaryTable className="my-4" data={courseSummaryData} />
    </div>
  );
}

export default DataView;
