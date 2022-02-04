import { dataDisplay } from "../lib/dataDisplay";

function TableData({ isFirstCol, data }) {
  return (
    <td
      className={`${
        isFirstCol ? "font-medium" : "font-light"
      } px-6 py-3 text-sm text-gray-900 overflow-x-auto `}
      style={{ wordBreak: "break-word" }}
    >
      {dataDisplay(data)}
    </td>
  );
}
export default TableData;
