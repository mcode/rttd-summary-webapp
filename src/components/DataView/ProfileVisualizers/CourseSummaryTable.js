import SimpleDataTable from "../SimpleDataTable";
import MultiEntryDataTable from "../MultiEntryDataTable";
import TwoColumnDataTable from "../TwoColumnDataTable";
import EmptyDataTable from "../EmptyDataTable";
import _ from "lodash";

function CourseSummaryTable({ data = [], className }) {
  if (_.isEmpty(data)) {
    return <EmptyDataTable title="Course Summary" className={className} />;
  }
  return data.map((courseSummary, i) => {
    const title = `Course Summary ${i + 1}`;
    const numVolumes =
      courseSummary["Number of Delivered Fractions"] &&
      courseSummary["Number of Delivered Fractions"].length;
    const volumesData = [];
    for (let i = 0; i < numVolumes; i++) {
      volumesData.push({
        "Number of Delivered Fractions":
          courseSummary["Number of Delivered Fractions"][i],
        "Total Delivered Dose [cGy]":
          courseSummary["Total Delivered Dose [cGy]"][i],
        "Volume Label": courseSummary["Volume Label"][i],
      });
    }
    const courseData = { ...courseSummary };
    const modalityData = courseSummary["Modalities"];
    delete courseData["Modalities"];
    delete courseData["Number of Delivered Fractions"];
    delete courseData["Total Delivered Dose [cGy]"];
    delete courseData["Volume Label"];
    return (
      <div key={i} className={className}>
        {/* Display the base course data with a simple table */}
        <SimpleDataTable data={courseData} title={title} />
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
          title="Dose Delivered to Volumes"
          columnTitle="Dose to Volume"
        />
      </div>
    );
  });
}

export default CourseSummaryTable;
