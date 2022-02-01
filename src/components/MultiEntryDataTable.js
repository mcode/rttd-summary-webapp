import { hashData } from "../lib/hashData";

function MultiEntryDataTable({ dataArray, title, columnTitle, className }) {
  // Don't render if there is no dataArray
  if (dataArray.length === 0) return;
  const exampleInstance = dataArray[0];
  const keys = Object.keys(exampleInstance);
  //  Each row is the key followed by all the values it follows.
  const rows = keys.map((k, i) => {
    return [k].concat(dataArray.map((elem) => elem[k]));
  });

  return (
    <table
      className={`table-auto border text-left block max-w-screen-2xl overflow-auto ${className}`}
    >
      <thead className="border-b bg-slate-200">
        <tr>
          <th className="text-sm font-medium text-gray-900 px-6 py-3 text-left">
            {title}
          </th>
          {dataArray.map((instance, i) => {
            return (
              <th
                key={hashData(instance)}
                className="text-sm font-normal text-gray-900 px-6 py-3 text-left"
              >
                {`${columnTitle} ${i + 1}`}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          return (
            <tr
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              key={row[0]}
            >
              {row.map((elem, i) => (
                <td
                  className={`${
                    // If this is the first column, style the font differently
                    i === 0 ? "font-medium" : "font-light"
                  } text-sm text-gray-900 px-6 py-3 whitespace-nowrap`}
                  key={elem + i}
                >
                  {elem}
                  {/* testing */}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default MultiEntryDataTable;
