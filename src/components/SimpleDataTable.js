import TableData from "./TableData";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

function SimpleDataTable({ data = {}, title, className }) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  return (
    <div
      className={`max-w-screen-xl w-min border overflow-x-auto ${className} table-container`}
    >
      <table className={`table-fixed text-left `}>
        <thead>
          <tr className="border-b bg-slate-200">
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
    </div>
  );
}
export default SimpleDataTable;
