import MultiEntryDataTable from "../MultiEntryDataTable";
import EmptyDataTable from "../EmptyDataTable";
import _ from "lodash";

function TreatmentVolumeTable({ data = [], className }) {
  if (_.isEmpty(data)) {
    return (
      <EmptyDataTable
        title="Radiotherapy Volumes (Targets)"
        className={className}
      />
    );
  }
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
