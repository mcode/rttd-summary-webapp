import _ from "lodash";
import SimpleDataTable from "../SimpleDataTable";
import MultiEntryDataTable from "../MultiEntryDataTable";
import TwoColumnDataTable from "../TwoColumnDataTable";
import EmptyDataTable from "../EmptyDataTable";

function PlannedTreatmentPhaseTable({ data = [], className }) {
  if (_.isEmpty(data)) {
    return (
      <EmptyDataTable title="Planned Treatment Phase" className={className} />
    );
  }
  return data.map((plannedPhase, i) => {
    const title = `Planned Treatment Phase ${i + 1}`;
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
        "Volume Label": plannedPhase["Volume Label"][i],
      });
    }
    const plannedPhaseData = { ...plannedPhase };
    const modalityData = plannedPhase["Modalities"];
    delete plannedPhaseData["Modalities"];
    delete plannedPhaseData["Planned Dose per Fraction [cGy]"];
    delete plannedPhaseData["Total Planned Dose [cGy]"];
    delete plannedPhaseData["Volume Label"];
    delete plannedPhaseData.metadata;
    return (
      <div className={className} key={i}>
        {/* Display the base phase data with a simple table */}
        <SimpleDataTable data={plannedPhaseData} title={title} />
        {/* Display Modality and Technique data with a two column table */}
        {modalityData && modalityData.length > 0 && (
          <TwoColumnDataTable
            data={modalityData}
            column1="Modality"
            column2="Techniques"
          />
        )}
        {/* Display the volume data with the multi-entry table */}
        <MultiEntryDataTable
          dataArray={volumesData}
          title="Planned Dose to Volumes"
          columnTitle="Dose to Volume"
        />
        {plannedPhase.metadata ? (
          <SimpleDataTable
            data={plannedPhase.metadata}
            title="Resource Metadata"
          />
        ) : undefined}
      </div>
    );
  });
}

export default PlannedTreatmentPhaseTable;
