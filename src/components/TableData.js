import { dataDisplay } from "../lib/dataDisplay";

function TableData({ isFirstCol, data }) {
  return (
    <td
      className={`${
        isFirstCol ? "w-48 font-medium" : "w-96 font-light"
      } px-6 py-3 text-sm text-gray-900 break-words`}
    >
      {dataDisplay(data)}
    </td>
  );
}
export default TableData;
