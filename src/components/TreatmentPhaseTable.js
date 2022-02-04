import _ from "lodash";
import SimpleDataTable from "./SimpleDataTable";
import MultiEntryDataTable from "./MultiEntryDataTable";

function TreatmentPhaseTable({ data, title, className }) {
  // Flatten so we don't make space for empty entries
  const numVolumes = _.flatten(
    data["Total Dose Delivered from Phase [cGy]"]
  ).length;
  const volumesData = [];
  for (let i = 0; i < numVolumes; i++) {
    volumesData.push({
      "Dose Per Fraction [cGy]": data["Dose Per Fraction [cGy]"][i],
      "Total Dose Delivered from Phase [cGy]":
        data["Total Dose Delivered from Phase [cGy]"][i],
    });
  }
  const phaseData = { ...data };
  delete phaseData["Total Dose Delivered from Phase [cGy]"];
  return (
    <div className={className}>
      {/* Display the base phase data with a simple table */}
      <SimpleDataTable data={phaseData} title={title} />
      {/* Display the volume data with the multi-entry table */}
      <MultiEntryDataTable
        dataArray={volumesData}
        title="Dose Delivered to Volumes"
        columnTitle="Dose to Volume"
      />
    </div>
  );
}

export default TreatmentPhaseTable;
