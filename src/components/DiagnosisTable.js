import SimpleDataTable from "./SimpleDataTable";

function DiagnosisTable({ data, className }) {
  return (
    <SimpleDataTable
      data={data}
      className={className}
      title="Diagnosis Table Goes Here"
    />
  );
}

export default DiagnosisTable;
