import SimpleDataTable from "./SimpleDataTable";

function TreatmentPhaseTable({ data, className }) {
  return (
    <SimpleDataTable
      data={data}
      className={className}
      title="Treatment Phase Data Goes Here"
    />
  );
}

export default TreatmentPhaseTable;
