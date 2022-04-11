import { Trash } from "react-feather";

function PatientQueryList({
  patientQueries,
  setPatientQueries,
  openRequestForm,
  setCurrentPatientQuery,
}) {
  /**
   * Remove a current query # from a list
   * @param {int} index
   * @returns nothing; sets state to update patientQueries
   */
  function removeIthPatientId(index) {
    if (index < 0 || index > patientQueries.length) return;
    setPatientQueries(
      patientQueries
        .slice(0, index)
        .concat(patientQueries.slice(index + 1, patientQueries.length))
    );
  }

  function generateQueryDisplayText(queryObj) {
    let displayStr = "";
    if (queryObj.id) {
      displayStr += `id: ${queryObj.id}`;
    }
    if (queryObj.givenName) {
      displayStr += `${displayStr ? "; " : ""}givenName: ${queryObj.givenName}`;
    }
    if (queryObj.familyName) {
      displayStr += `${displayStr ? "; " : ""}familyName: ${
        queryObj.familyName
      }`;
    }
    if (queryObj.birthDate) {
      displayStr += `${displayStr ? "; " : ""}birthDate: ${queryObj.birthDate}`;
    }
    if (queryObj.gender) {
      displayStr += `${displayStr ? "; " : ""}gender: ${queryObj.gender}`;
    }
    return displayStr;
  }

  function handleQuerySelection(queryObj, queryIdx) {
    setCurrentPatientQuery(queryObj);
    openRequestForm(queryIdx);
  }

  return (
    <ul className="max-h-72 overflow-y-auto">
      {patientQueries.map((patientQuery, i) => {
        return (
          <li
            className="flex text-base border border-b-0 last:border-b border-slate-500 w-full p-2 justify-between items-center"
            key={i}
          >
            <button
              type="button"
              onClick={(e) => {
                handleQuerySelection(patientQuery, i);
              }}
            >
              {generateQueryDisplayText(patientQuery)}
            </button>
            <button
              type="button"
              className="flex"
              // Inline click handler specific to this ith element
              onClick={(e) => {
                e.preventDefault();
                removeIthPatientId(i);
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
export default PatientQueryList;
