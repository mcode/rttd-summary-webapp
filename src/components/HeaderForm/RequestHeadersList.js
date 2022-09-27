function RequestHeadersList({ requestHeaders, openHeaderForm }) {
  function handleHeaderSelection() {
    openHeaderForm();
  }

  return (
    <ul className="max-h-96 overflow-y-auto">
      {requestHeaders.map(([key, value]) => {
        return key && value ? (
          <li
            className="flex text-base border border-b-0 last:border-b border-slate-500 w-full p-2 justify-between items-center"
            key={key}
          >
            <button
              type="button"
              onClick={(e) => {
                handleHeaderSelection();
              }}
            >
              {`${key}: ${value}`}
            </button>
          </li>
        ) : undefined;
      })}
    </ul>
  );
}
export default RequestHeadersList;
