import _ from "lodash";
import SimpleDataTable from "../SimpleDataTable";
import MultiEntryDataTable from "../MultiEntryDataTable";
import EmptyDataTable from "../EmptyDataTable";

function PlannedTreatmentPhaseTable({ data = [], className }) {
  if (_.isEmpty(data)) {
    return <EmptyDataTable title="Planned Phase" className={className} />;
  }
  return data.map((plannedPhase, i) => {
    const title = `Planned Phase ${i + 1}`;
    // Compact so we don't make space for empty entries
    const numVolumes = _.compact(
      plannedPhase["Total Planned Dose [cGy]"]
    ).length;
    const volumesData = [];
    for (let i = 0; i < numVolumes; i++) {
      volumesData.push({
        "Planned Dose per Fraction [cGy]":
          plannedPhase["Planned Dose per Fraction [cGy]"][i],
        "Total Planned Dose [cGy]": plannedPhase["Total Planned Dose [cGy]"][i],
        "Body Sites": plannedPhase["Body Sites"][i],
      });
    }
    const plannedPhaseData = { ...plannedPhase };
    delete plannedPhaseData["Planned Dose per Fraction [cGy]"];
    delete plannedPhaseData["Total Planned Dose [cGy]"];
    delete plannedPhaseData["Body Sites"];
    return (
      <div className={className} key={i}>
        {/* Display the base phase data with a simple table */}
        <SimpleDataTable data={plannedPhaseData} title={title} />
        {/* Display the volume data with the multi-entry table */}
        <MultiEntryDataTable
          dataArray={volumesData}
          title="Planned Dose to Volumes"
          columnTitle="Dose to Volume"
        />
      </div>
    );
  });
}

export default PlannedTreatmentPhaseTable;
