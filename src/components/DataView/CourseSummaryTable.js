import SimpleDataTable from "./SimpleDataTable";
import MultiEntryDataTable from "./MultiEntryDataTable";

function CourseSummaryTable({ data, className }) {
  const numVolumes = data["Number of Delivered Fractions"].length;
  const volumesData = [];
  for (let i = 0; i < numVolumes; i++) {
    volumesData.push({
      "Number of Delivered Fractions": data["Number of Delivered Fractions"][i],
      "Total Delivered Dose to Course [cGy]":
        data["Total Delivered Dose to Course [cGy]"][i],
      "Body Sites": data["Body Sites"][i],
    });
  }
  const courseData = { ...data };
  delete courseData["Number of Delivered Fractions"];
  delete courseData["Total Delivered Dose to Course [cGy]"];
  delete courseData["Body Sites"];
  return (
    <div className={className}>
      {/* Display the base course data with a simple table */}
      <SimpleDataTable data={courseData} title="Course Summary" />
      {/* Display the volume data with the multi-entry table */}
      <MultiEntryDataTable
        dataArray={volumesData}
        title="Dose Delivered to Volumes"
        columnTitle="Dose to Volume"
      />
    </div>
  );
}

export default CourseSummaryTable;
