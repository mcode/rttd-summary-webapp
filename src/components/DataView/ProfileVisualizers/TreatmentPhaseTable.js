import _ from "lodash";
import SimpleDataTable from "../SimpleDataTable";
import MultiEntryDataTable from "../MultiEntryDataTable";
import EmptyDataTable from "../EmptyDataTable";

function TreatmentPhaseTable({ data = [], className }) {
  if (_.isEmpty(data)) {
    return <EmptyDataTable title="Phase" className={className} />;
  }
  return data.map((treatmentPhase, i) => {
    const title = `Phase ${i + 1}`;
    // Compact so we don't make space for empty entries
    const numVolumes = _.compact(
      treatmentPhase["Total Dose Delivered [cGy]"]
    ).length;
    const volumesData = [];
    for (let i = 0; i < numVolumes; i++) {
      volumesData.push({
        "Total Dose Delivered [cGy]":
          treatmentPhase["Total Dose Delivered [cGy]"][i],
        Volume: treatmentPhase["Volume"][i],
      });
    }
    const treatmentPhaseData = { ...treatmentPhase };
    delete treatmentPhaseData["Total Dose Delivered [cGy]"];
    delete treatmentPhaseData["Volume"];
    return (
      <div className={className} key={i}>
        {/* Display the base phase data with a simple table */}
        <SimpleDataTable data={treatmentPhaseData} title={title} />
        {/* Display the volume data with the multi-entry table */}
        <MultiEntryDataTable
          dataArray={volumesData}
          title="Dose Delivered to Volumes"
          columnTitle="Dose to Volume"
        />
      </div>
    );
  });
}

export default TreatmentPhaseTable;
