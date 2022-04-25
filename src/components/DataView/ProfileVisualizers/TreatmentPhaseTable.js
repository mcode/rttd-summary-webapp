import _ from "lodash";
import SimpleDataTable from "../SimpleDataTable";
import MultiEntryDataTable from "../MultiEntryDataTable";

function TreatmentPhaseTable({ data = {}, className }) {
  if (!data) {
    return null;
  }
  return data.map((treatmentPhase, i) => {
    const title = `Phase ${i + 1}`;
    // Compact so we don't make space for empty entries
    const numVolumes = _.compact(
      treatmentPhase["Total Dose Delivered from Phase [cGy]"]
    ).length;
    const volumesData = [];
    for (let i = 0; i < numVolumes; i++) {
      volumesData.push({
        "Total Dose Delivered from Phase [cGy]":
          treatmentPhase["Total Dose Delivered from Phase [cGy]"][i],
        "Body Sites": treatmentPhase["Body Sites"][i],
      });
    }
    const treatmentPhaseData = { ...treatmentPhase };
    delete treatmentPhaseData["Total Dose Delivered from Phase [cGy]"];
    return (
      <div className={className}>
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
