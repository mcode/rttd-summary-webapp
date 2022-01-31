import PatientTable from "./PatientTable";
import CourseSummaryTable from "./CourseSummaryTable";

function getPatientData(data) {
  return data[0];
}

function getCourseSummaryData(data) {
  return data[1];
}

function DataView({ data }) {
  const patientData = getPatientData(data);
  const courseSummaryData = getCourseSummaryData(data);
  return (
    <div>
      <PatientTable className="m-4" data={patientData} />
      <CourseSummaryTable className="m-4" data={courseSummaryData} />
    </div>
  );
}

export default DataView;
