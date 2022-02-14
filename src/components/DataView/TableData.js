import { dataDisplay } from "../../lib/dataDisplay";

function TableData({ isFirstCol, data }) {
  if (isFirstCol) {
    return (
      <th
        scope="row"
        className={`font-medium px-6 py-3 text-sm text-gray-900 overflow-x-auto `}
        style={{
          wordBreak: "break-word",
          minWidth: "10rem",
        }}
      >
        {dataDisplay(data)}
      </th>
    );
  } else {
    return (
      <td
        className={`font-light px-6 py-3 text-sm text-gray-900 overflow-x-auto `}
        style={{
          wordBreak: "break-word",
          minWidth: "20rem",
        }}
      >
        {dataDisplay(data)}
      </td>
    );
  }
}
export default TableData;
