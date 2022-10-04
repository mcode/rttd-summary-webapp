import { dataDisplay } from "../../lib/dataDisplay";

function TableData({ isFirstCol, data, customStyles = {} }) {
  if (isFirstCol) {
    return (
      <th
        scope="row"
        className={`font-medium px-6 py-3 text-sm text-gray-900 overflow-x-auto whitespace-pre-wrap`}
        style={{
          wordBreak: "break-word",
          minWidth: "10rem",
          ...customStyles,
        }}
      >
        {dataDisplay(data)}
      </th>
    );
  } else {
    return (
      <td
        className={`font-light px-6 py-3 text-sm text-gray-900 overflow-x-auto whitespace-pre-wrap`}
        style={{
          wordBreak: "break-word",
          minWidth: "20rem",
          ...customStyles,
        }}
      >
        {dataDisplay(data)}
      </td>
    );
  }
}
export default TableData;
