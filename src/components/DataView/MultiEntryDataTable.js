import TableData from "./TableData";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import "./table.css";

function MultiEntryDataTable({
  dataArray = [],
  title,
  columnTitle,
  className,
  additionalHeader = "",
}) {
  const exampleInstance = dataArray.length > 0 && dataArray[0];
  const keys =
    exampleInstance &&
    Object.keys(exampleInstance).filter((key) => key !== additionalHeader);
  //  Each row is the key followed by all the values it follows.
  const rows = keys
    ? keys.map((k, i) => {
        return [k].concat(dataArray.map((elem) => elem[k]));
      })
    : [];

  return (
    <div
      className={`w-min border overflow-x-auto ${className} table-container`}
    >
      <table className={`table-fixed text-left`}>
        <thead className="border-b bg-slate-200">
          <tr>
            <TableHeader isFirstCol text={title} />
            {/* Header for each element we have data for */}
            {dataArray.map((instance, i) => {
              return (
                <TableHeader
                  key={i}
                  text={`${columnTitle} ${i + 1}${
                    additionalHeader ? ` (${instance[additionalHeader]})` : ""
                  }`}
                />
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            return (
              <TableRow key={row[0]}>
                {row.map((elem, i) => (
                  <TableData
                    isFirstCol={i === 0}
                    key={`${elem}` + i.toString()}
                    data={elem}
                  />
                ))}
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default MultiEntryDataTable;
