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
  const volumeData = [];
  const volumeMetadata = [];
  data.forEach((x) => {
    const { metadata, ...volume } = x;
    volumeData.push(volume);
    metadata && volumeMetadata.push(metadata);
  });
  return (
    <div className={className}>
      <MultiEntryDataTable
        dataArray={volumeData}
        title="Radiotherapy Volumes (Targets)"
        columnTitle="Volume"
        additionalHeader="Volume Label"
      />
      {volumeMetadata && volumeMetadata.length > 0 ? (
        <MultiEntryDataTable
          dataArray={volumeMetadata}
          title="Resource Metadata"
          columnTitle="Volume"
        />
      ) : undefined}
    </div>
  );
}

export default TreatmentVolumeTable;
