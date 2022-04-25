import SimpleDataTable from "../SimpleDataTable";

function PatientTable({ data = {}, className }) {
  return (
    <SimpleDataTable
      data={data}
      className={className}
      title="Patient Information"
    />
  );
}

export default PatientTable;
