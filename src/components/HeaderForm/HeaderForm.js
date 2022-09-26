function HeaderForm({
  currentHeaderSet,
  requestHeaders,
  setRequestHeaders,
  setDisplay,
  setCurrentHeaderSet,
  currentHeaderKey,
}) {
  function handleClose() {
    setDisplay(false);
  }

  function handleKeyChange(e) {
    let value = e.target.value;
    setCurrentHeaderSet([value, currentHeaderSet[1]]);
  }

  function handleValueChange(e) {
    let value = e.target.value;
    setCurrentHeaderSet([currentHeaderSet[0], value]);
  }

  function saveHeader() {
    const headerObj = { ...requestHeaders };
    delete headerObj[currentHeaderKey];
    headerObj[currentHeaderSet[0]] = currentHeaderSet[1];
    setRequestHeaders(headerObj);
    handleClose();
  }
  return (
    <>
      <div
        onMouseDown={handleClose}
        className="grid place-items-center absolute inset-0 outline-none overflow-x-hidden overflow-y-auto bg-gray-400/50"
      >
        <div
          style={{ borderWidth: "1px" }}
          className="lg:w-4/12 p-3 rounded-lg border-black bg-white"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-2">
            <label className="text-center text-lg mb-1" htmlFor="key-input">
              Key
            </label>
            <label className="text-center text-lg mb-1" htmlFor="value-input">
              Value
            </label>
          </div>
          <div className="grid grid-cols-2">
            <input
              id="key-input"
              type="text"
              className="border border-slate-500 mr-4 mb-4 p-2"
              placeholder="e.g. Content-Type"
              value={currentHeaderSet[0] || ""}
              onChange={handleKeyChange}
            ></input>
            <input
              id="value-input"
              type="text"
              className="border border-slate-500 ml-4 mb-4 p-2"
              placeholder="e.g. application/json"
              value={currentHeaderSet[1] || ""}
              onChange={handleValueChange}
            ></input>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="mx-2 border border-gray-400 px-1 hover:bg-slate-200 cursor-pointer transition-all shadow-lg active:shadow bg-slate-100"
              type="button"
              onClick={saveHeader}
            >
              Save Header
            </button>
            <button
              type="button"
              className="mx-2 border border-gray-400 px-1 hover:bg-red-300 cursor-pointer transition-all shadow-lg active:shadow bg-red-200"
              onClick={(e) => {
                handleClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderForm;
