import SimpleDataTable from "./SimpleDataTable";

function CourseSummaryTable({ data, className }) {
  return (
    <SimpleDataTable data={data} className={className} title="Course Summary" />
  );
}

export default CourseSummaryTable;
