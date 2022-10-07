import TableData from "./TableData";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

function TwoColumnDataTable({ data = [], column1, column2, className }) {
  return (
    <div
      className={`max-w-screen-xl w-min border overflow-x-auto ${className} table-container`}
    >
      <table className={`table-fixed text-left `}>
        <thead>
          <tr className="border-b bg-slate-200">
            <TableHeader isFirstCol text={column1} />
            <TableHeader text={column2} />
          </tr>
        </thead>
        <tbody>
          {data.map((value, i) => {
            return (
              <TableRow key={`${column1}-${i}`}>
                <TableData
                  customStyles={{ minWidth: "10rem" }}
                  data={value[column1]}
                />
                <TableData
                  customStyles={{ minWidth: "10rem" }}
                  data={value[column2]}
                />
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default TwoColumnDataTable;
