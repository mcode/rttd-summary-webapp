import SimpleDataTable from "../SimpleDataTable";
import MultiEntryDataTable from "../MultiEntryDataTable";
import EmptyDataTable from "../EmptyDataTable";
import _ from "lodash";

function PlannedCourseTable({ data = [], className }) {
  if (_.isEmpty(data)) {
    return <EmptyDataTable title="Planned Course" className={className} />;
  }
  return data.map((plannedCourse, i) => {
    const title = `Planned Course ${i + 1}`;
    const numVolumes =
      plannedCourse["Number of Planned Fractions"] &&
      plannedCourse["Number of Planned Fractions"].length;
    const volumesData = [];
    for (let i = 0; i < numVolumes; i++) {
      volumesData.push({
        "Number of Planned Fractions":
          plannedCourse["Number of Planned Fractions"][i],
        "Total Planned Dose [cGy]":
          plannedCourse["Total Planned Dose [cGy]"][i],
        "Volume Label": plannedCourse["Volume Label"][i],
      });
    }
    const plannedCourseData = { ...plannedCourse };
    delete plannedCourseData["Number of Planned Fractions"];
    delete plannedCourseData["Total Planned Dose [cGy]"];
    delete plannedCourseData["Volume Label"];
    delete plannedCourseData.metadata;
    return (
      <div key={i} className={className}>
        {/* Display the base course data with a simple table */}
        <SimpleDataTable data={plannedCourseData} title={title} />
        {/* Display the volume data with the multi-entry table */}
        <MultiEntryDataTable
          dataArray={volumesData}
          title="Planned Dose to Volumes"
          columnTitle="Dose to Volume"
        />
        {plannedCourse.metadata ? (
          <SimpleDataTable
            data={plannedCourse.metadata}
            title="Resource Metadata"
          />
        ) : undefined}
      </div>
    );
  });
}

export default PlannedCourseTable;
