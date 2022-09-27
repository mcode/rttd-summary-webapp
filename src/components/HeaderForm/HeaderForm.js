import { Fragment, useState } from "react";
import { Trash, Plus } from "react-feather";

function HeaderForm({ requestHeaders, setRequestHeaders, setDisplay }) {
  const [editedRequestHeaders, setEditedRequestHeaders] = useState([
    ...requestHeaders,
  ]);

  function handleClose() {
    setDisplay(false);
  }

  function addHeader() {
    const modifiedHeadersArr = [...editedRequestHeaders];
    modifiedHeadersArr.push(["", ""]);
    setEditedRequestHeaders(modifiedHeadersArr);
  }

  function removeHeader(idx) {
    let modifiedHeadersArr = [...editedRequestHeaders];
    modifiedHeadersArr.splice(idx, 1);
    setEditedRequestHeaders(modifiedHeadersArr);
  }

  function handleKeyChange(e) {
    // Update relevant tuple
    let value = e.target.value;
    let changedSetIdx = e.target.id.replace("requestkey-", "");
    const changedSet = [...editedRequestHeaders[changedSetIdx]];
    changedSet[0] = value;

    // Update request headers prop
    let modifiedHeadersArr = [...editedRequestHeaders];
    modifiedHeadersArr.splice(changedSetIdx, 1, changedSet);
    setEditedRequestHeaders(modifiedHeadersArr);
  }

  function handleValueChange(e) {
    // Update relevant tuple
    let value = e.target.value;
    let changedSetIdx = e.target.id.replace("requestvalue-", "");
    const changedSet = [...editedRequestHeaders[changedSetIdx]];
    changedSet[1] = value;

    // Update request headers prop
    let modifiedHeadersArr = [...editedRequestHeaders];
    modifiedHeadersArr.splice(changedSetIdx, 1, changedSet);
    setEditedRequestHeaders(modifiedHeadersArr);
  }

  function saveHeader() {
    setRequestHeaders(editedRequestHeaders);
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
          className="lg:w-4/12 p-3 rounded-lg border-black bg-white max-h-fit"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-12 ">
            <label
              className="text-center text-lg mb-1 col-span-5"
              htmlFor="key-input"
            >
              Key
            </label>
            <label
              className="text-center text-lg mb-1 col-span-6"
              htmlFor="value-input"
            >
              Value
            </label>
            <Plus className="inline ml-3" size={24} onClick={addHeader}></Plus>
          </div>
          <hr></hr>
          <div className="grid grid-cols-12 overflow-auto max-h-96 mt-4">
            {editedRequestHeaders.length > 0 ? (
              editedRequestHeaders.map(([key, value], idx) => {
                return (
                  <Fragment key={`headerfield-${idx}`}>
                    <input
                      id={`requestkey-${idx}`}
                      type="text"
                      key={`requestkey-${idx}`}
                      className="border border-slate-500 mr-4 mb-4 p-2 col-span-5"
                      placeholder="e.g. Content-Type"
                      value={key || ""}
                      onChange={handleKeyChange}
                    ></input>
                    <input
                      id={`requestvalue-${idx}`}
                      key={`requestvalue-${idx}`}
                      type="text"
                      className="border border-slate-500 ml-4 mb-4 p-2 col-span-6"
                      placeholder="e.g. application/json"
                      value={value || ""}
                      onChange={handleValueChange}
                    ></input>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeHeader(idx);
                      }}
                    >
                      <Trash className="inline mb-4" size={20} />
                    </button>
                  </Fragment>
                );
              })
            ) : (
              <p className={"text-lg col-span-12 text-center italic mb-4"}>
                No header fields
              </p>
            )}
          </div>
          <hr></hr>
          <div className="flex justify-center items-center mt-2">
            <button
              className="mx-2 border border-gray-400 px-1 hover:bg-slate-200 cursor-pointer transition-all shadow-lg active:shadow bg-slate-100"
              type="button"
              onClick={saveHeader}
            >
              Save Headers
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
