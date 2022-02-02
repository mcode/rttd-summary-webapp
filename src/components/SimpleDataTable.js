import TableData from "./TableData";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

function SimpleDataTable({ data = {}, title, className }) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return (
    <table
      className={`table-fixed max-w-screen-xl border text-left ${className}`}
    >
      <thead className="border-b bg-slate-200">
        <tr>
          <TableHeader isFirstCol text={title} />
          <TableHeader />
        </tr>
      </thead>
      <tbody>
        {values.map((v, i) => {
          return (
            <TableRow key={`${keys[i]}-${v}`}>
              <TableData isFirstCol data={keys[i]} />
              <TableData data={v} />
            </TableRow>
          );
        })}
      </tbody>
    </table>
  );
}
export default SimpleDataTable;
