import SimpleDataTable from "../SimpleDataTable";
import EmptyDataTable from "../EmptyDataTable";
import _ from "lodash";

function PatientTable({ data = {}, className }) {
  if (_.isEmpty(data)) {
    return <EmptyDataTable title="Patient Information" className={className} />;
  }
  return (
    <SimpleDataTable
      data={data}
      className={className}
      title="Patient Information"
    />
  );
}

export default PatientTable;
