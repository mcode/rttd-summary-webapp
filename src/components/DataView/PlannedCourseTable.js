import SimpleDataTable from "./SimpleDataTable";
import MultiEntryDataTable from "./MultiEntryDataTable";

function PlannedCourseTable({ data = {}, className }) {
  if (!data) {
    return null;
  }
  return data.map((plannedCourse, i) => {
    const numVolumes =
      plannedCourse["Number of Planned Fractions"] &&
      plannedCourse["Number of Planned Fractions"].length;
    const volumesData = [];
    for (let i = 0; i < numVolumes; i++) {
      volumesData.push({
        "Number of Planned Fractions":
          plannedCourse["Number of Planned Fractions"][i],
        "Total Planned Dose to Course [cGy]":
          plannedCourse["Total Planned Dose to Course [cGy]"][i],
        "Body Sites": plannedCourse["Body Sites"][i],
      });
    }
    const plannedCourseData = { ...plannedCourse };
    delete plannedCourseData["Number of Planned Fractions"];
    delete plannedCourseData["Total Planned Dose to Course [cGy]"];
    delete plannedCourseData["Body Sites"];
    return (
      <div key={i} className={className}>
        {/* Display the base course data with a simple table */}
        <SimpleDataTable
          data={plannedCourseData}
          title={`Planned Course ${i + 1}`}
        />
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

export default PlannedCourseTable;
