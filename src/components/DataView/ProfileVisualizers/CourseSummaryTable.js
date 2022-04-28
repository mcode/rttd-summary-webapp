import SimpleDataTable from "../SimpleDataTable";
import MultiEntryDataTable from "../MultiEntryDataTable";

function CourseSummaryTable({ data = [], className }) {
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
        "Body Sites": courseSummary["Body Sites"][i],
      });
    }
    const courseData = { ...courseSummary };
    delete courseData["Number of Delivered Fractions"];
    delete courseData["Total Delivered Dose [cGy]"];
    delete courseData["Body Sites"];
    return (
      <div key={i} className={className}>
        {/* Display the base course data with a simple table */}
        <SimpleDataTable data={courseData} title={title} />
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
