import { Plus } from "react-feather";
import PatientIdList from "./PatientIdList";

function PatientIdInput({
  patientIdInput,
  setPatientIdInput,
  patientIds,
  setPatientIds,
}) {
  /**
   * Single function to add the current patientIdInput to the list of ids
   * @returns Nothing; Empties patientIdInput and adds current patientIdInput to patientIds list
   */
  function addToPatientIds() {
    if (patientIdInput === "") return;
    setPatientIds([patientIdInput, ...patientIds]);
    setPatientIdInput("");
  }

  /**
   * Update controlled state when input element is updated
   * @param {Event} e
   */
  function handleInputUpdate(e) {
    const value = e.target.value;
    setPatientIdInput(value);
  }

  /**
   * When enter is hit in the input box, trigger patient addition
   * @param {Event} e
   */
  function handleInputEnter(e) {
    if (e.key === "Enter") {
      handlePatientAdd(e);
    }
  }

  /**
   * Function for handling AddPatient event logic
   * @param {Event} e
   */
  function handlePatientAdd(e) {
    // Avoid triggering the form's submit logic
    e.preventDefault();
    addToPatientIds();
  }

  return (
    <div id="patient-ids-section" className="mb-4">
      <label className="text-lg italic mb-1" htmlFor="patientIds">
        Patient IDs
      </label>
      <div id="id-input-row" className="flex rounded-t-lg mb-4">
        <input
          type="text"
          id="patientIds"
          name="patientIds"
          placeholder="e.g. PatientMrn123"
          className="border border-slate-500 p-2 w-10/12"
          value={patientIdInput}
          onChange={handleInputUpdate}
          onKeyPress={handleInputEnter}
        />
        <button type="button" className="" onClick={handlePatientAdd}>
          <Plus className="inline m-2" size={24} />
        </button>
      </div>
      {patientIds.length > 0 && (
        <PatientIdList patientIds={patientIds} setPatientIds={setPatientIds} />
      )}
    </div>
  );
}

export default PatientIdInput;
