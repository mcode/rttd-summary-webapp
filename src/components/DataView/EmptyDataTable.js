import SimpleDataTable from "./SimpleDataTable";

function EmptyDataTable({ title, className }) {
  return (
    <SimpleDataTable
      className={className}
      data={{ "No data found": "" }}
      title={title}
    />
  );
}

export default EmptyDataTable;
