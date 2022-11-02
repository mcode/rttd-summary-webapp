function PatientIdInput({ currentPatientQuery, setCurrentPatientQuery }) {
  /**
   * Update controlled state when input element is updated
   * @param {Event} e
   */
  function handleInputUpdate(e) {
    const value = e.target.value;
    setCurrentPatientQuery({ ...currentPatientQuery, id: value });
  }

  return (
    <div id="patient-ids-section" className="mb-4">
      <label className="text-lg m-1" htmlFor="patientIds">
        Patient FHIR Resource ID
      </label>
      <div id="id-input-row" className="flex rounded-t-lg mb-4 justify-center">
        <input
          type="text"
          id="patientIds"
          name="patientIds"
          placeholder="e.g. PatientMrn123"
          className="border border-slate-500 p-2 w-10/12"
          value={currentPatientQuery.id}
          onChange={handleInputUpdate}
        />
      </div>
    </div>
  );
}

export default PatientIdInput;
