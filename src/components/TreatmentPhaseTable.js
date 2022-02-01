import SimpleDataTable from "./SimpleDataTable";

function TreatmentPhaseTable({ data, title, className }) {
  return <SimpleDataTable data={data} className={className} title={title} />;
}

export default TreatmentPhaseTable;
