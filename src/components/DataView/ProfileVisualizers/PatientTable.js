import SimpleDataTable from "../SimpleDataTable";
import EmptyDataTable from "../EmptyDataTable";
import _ from "lodash";

function PatientTable({ data = {}, className }) {
  if (_.isEmpty(data)) {
    return <EmptyDataTable title="Patient Information" className={className} />;
  }
  const { metadata, ...patientData } = data;
  return (
    <div className={className}>
      <SimpleDataTable data={patientData} title="Patient Information" />
      {metadata ? (
        <SimpleDataTable data={metadata} title="Resource Metadata" />
      ) : undefined}
    </div>
  );
}

export default PatientTable;
