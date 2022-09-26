import { Trash } from "react-feather";

function RequestHeadersList({
  requestHeader,
  setRequestHeaders,
  openHeaderForm,
}) {
  /**
   * Remove a current query # from a list
   * @param {int} index
   * @returns nothing; sets state to update patientQueries
   */
  function removeHeader(key) {
    const requestObj = { ...requestHeader };
    delete requestObj[key];
    setRequestHeaders(requestObj);
  }

  function handleHeaderSelection(key, value) {
    openHeaderForm([key, value]);
  }

  return (
    <ul className="max-h-96 overflow-y-auto">
      {Object.entries(requestHeader).map(([key, value]) => {
        return (
          <li
            className="flex text-base border border-b-0 last:border-b border-slate-500 w-full p-2 justify-between items-center"
            key={key}
          >
            <button
              type="button"
              onClick={(e) => {
                handleHeaderSelection(key, value);
              }}
            >
              {`${key}: ${value}`}
            </button>
            <button
              type="button"
              className="flex"
              // Inline click handler specific to this ith element
              onClick={(e) => {
                e.preventDefault();
                removeHeader(key);
              }}
            >
              <Trash className="inline" size={16} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
export default RequestHeadersList;
