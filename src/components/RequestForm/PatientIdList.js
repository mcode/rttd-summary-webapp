import { Trash } from "react-feather";

function PatientIdList({ patientIds, setPatientIds }) {
  /**
   * Remove a current id # from a list
   * @param {int} index
   * @returns nothing; sets state to update patientIds
   */
  function removeIthPatientId(index) {
    if (index < 0 || index > patientIds.length) return;
    setPatientIds(
      patientIds
        .slice(0, index)
        .concat(patientIds.slice(index + 1, patientIds.length))
    );
  }
  return (
    <ul className="max-h-72 overflow-y-auto border border-slate-500 ">
      {patientIds.map((id, i) => {
        return (
          <li
            className="flex text-base border-b last:border-b-0 border-slate-500 w-full p-2 justify-between items-center"
            key={i}
          >
            {id}
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
export default PatientIdList;
