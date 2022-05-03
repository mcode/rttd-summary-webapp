import PatientTable from "./ProfileVisualizers/PatientTable";
import TreatmentVolumeTable from "./ProfileVisualizers/TreatmentVolumeTable";
import PlannedTreatmentPhaseTable from "./ProfileVisualizers/PlannedTreatmentPhaseTable";
import TreatmentPhaseTable from "./ProfileVisualizers/TreatmentPhaseTable";
import CourseSummaryTable from "./ProfileVisualizers/CourseSummaryTable";
import PlannedCourseTable from "./ProfileVisualizers/PlannedCourseTable";
import PatientSelect from "./PatientSelect";
import SimpleDataTable from "./SimpleDataTable";
import { useState } from "react";
import _ from "lodash";

/**
 * Parse and reformat patient data for visualization
 * @param {Object[]} selectedPatientId Patient to get data for
 * @param {Object} resourceMap All resources mapped from all available patient data
 * @returns Patient data formatted for the PatientTable visualizer
 */
function getPatientData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[0];
}

/**
 * Parse and reformat treatment volume data for visualization
 * @param {Object[]} selectedPatientId Patient to get data for
 * @param {Object} resourceMap All resources mapped from all available patient data
 * @returns Treatment volume data formatted for the CourseSummaryTable visualizer
 */
function getTreatmentVolumesData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[3];
}

/**
 * Parse and reformat phase data for visualization
 * @param {Object[]} selectedPatientId Patient to get data for
 * @param {Object} resourceMap All resources mapped from all available patient data
 * @returns Phase data formatted for the TreatmentPhaseTable visualizer
 */
function getTreatmentPhaseData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[1];
}

/**
 * Parse and reformatPlanned  phase data for visualization
 * @param {Object[]} selectedPatientId Patient to get data for
 * @param {Object} resourceMap All resources mapped from all available patient data
 * @returns Phase data formatted for the PlannedTreatmentPhaseTable visualizer
 */
function getPlannedTreatmentPhaseData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[5];
}

/**
 * Parse and reformat planned course for visualization
 * @param {Object[]} selectedPatientId Patient to get data for
 * @param {Object} resourceMap All resources mapped from all available patient data
 * @returns Phase data formatted for the PlannedCourseTable visualizer
 */
function getPlannedCourseData(selectedPatientId, resourceMap) {
  const patientData = resourceMap.get(selectedPatientId);
  return patientData && patientData[4];
}

/**
 * Parse and reformat course summary data for visualization
 * @param {Object[]} selectedPatientId Patient to get data for
 * @param {Object} resourceMap All resources mapped from all available patient data
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
  const plannedTreatmentPhaseData = getPlannedTreatmentPhaseData(
    selectedPatientId,
    resourceMap
  );
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
  const plannedCourseData = getPlannedCourseData(
    selectedPatientId,
    resourceMap
  );

  const hasPatientData =
    !_.isEmpty(patientData) ||
    !_.isEmpty(plannedTreatmentPhaseData) ||
    !_.isEmpty(treatmentPhaseData) ||
    !_.isEmpty(treatmentVolumesData) ||
    !_.isEmpty(plannedCourseData) ||
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
          {!_.isEmpty(patientData) ? (
            <PatientTable className="my-4" data={patientData} />
          ) : (
            <SimpleDataTable
              className="my-4"
              data={{ "No data found": "" }}
              title={"Patient Information"}
            />
          )}
          {!_.isEmpty(treatmentVolumesData) ? (
            <TreatmentVolumeTable
              className="my-4"
              data={treatmentVolumesData}
            />
          ) : (
            <SimpleDataTable
              className="my-4"
              data={{ "No data found": "" }}
              title={"Radiotherapy Volumes (Targets)"}
            />
          )}
          {!_.isEmpty(treatmentPhaseData) ? (
            <TreatmentPhaseTable className="my-4" data={treatmentPhaseData} />
          ) : (
            <SimpleDataTable
              className="my-4"
              data={{ "No data found": "" }}
              title={"Phase"}
            />
          )}
          {!_.isEmpty(plannedTreatmentPhaseData) ? (
            <PlannedTreatmentPhaseTable
              className="my-4"
              data={plannedTreatmentPhaseData}
            />
          ) : (
            <SimpleDataTable
              className="my-4"
              data={{ "No data found": "" }}
              title={"Planned Phase"}
            />
          )}
          {!_.isEmpty(plannedCourseData) ? (
            <PlannedCourseTable className="my-4" data={plannedCourseData} />
          ) : (
            <SimpleDataTable
              className="my-4"
              data={{ "No data found": "" }}
              title={"Planned Course"}
            />
          )}
          {!_.isEmpty(courseSummaryData) ? (
            <CourseSummaryTable className="my-4" data={courseSummaryData} />
          ) : (
            <SimpleDataTable
              className="my-4"
              data={{ "No data found": "" }}
              title={"Course Summary"}
            />
          )}
        </>
      )}
    </>
  );
}

export default DataView;
