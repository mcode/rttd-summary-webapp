import MultiEntryDataTable from "./MultiEntryDataTable";

function TreatmentVolumeTable({ data }) {
  return (
    <MultiEntryDataTable
      dataArray={data}
      title="Radiotherapy Volumes (Targets)"
      columnTitle="Volume"
    />
  );
}

export default TreatmentVolumeTable;
