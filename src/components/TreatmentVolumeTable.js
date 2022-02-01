import MultiEntryDataTable from "./MultiEntryDataTable";

function TreatmentVolumeTable({ data, className }) {
  return (
    <MultiEntryDataTable
      dataArray={data}
      className={className}
      title="Radiotherapy Volumes (Targets)"
      columnTitle="Volume"
    />
  );
}

export default TreatmentVolumeTable;
