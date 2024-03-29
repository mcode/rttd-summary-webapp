function PatientIdInput({ currentPatientQuery, setCurrentPatientQuery }) {
  /**
   * Update controlled state when input element is updated
   * @param {Event} e
   */
  function handleIdInputUpdate(e) {
    const value = e.target.value;
    setCurrentPatientQuery({ ...currentPatientQuery, id: value });
  }
  function handleIdentifierInputUpdate(e) {
    const value = e.target.value;
    setCurrentPatientQuery({ ...currentPatientQuery, identifier: value });
  }
  function handleSystemInputUpdate(e) {
    const value = e.target.value;
    setCurrentPatientQuery({ ...currentPatientQuery, system: value });
  }

  return (
    <>
      <div id="patient-ids-section" className="mb-4">
        <label className="text-lg m-1" htmlFor="patientIds">
          Patient FHIR Resource ID
        </label>
        <div
          id="id-input-row"
          className="flex rounded-t-lg mb-4 justify-center"
        >
          <input
            type="text"
            id="patientIds"
            name="patientIds"
            placeholder="e.g. PatientFhirId123"
            className="border border-slate-500 p-2 w-10/12"
            value={currentPatientQuery.id}
            onChange={handleIdInputUpdate}
          />
        </div>
      </div>
      <hr></hr>
      <div id="patient-identifier-section" className="mb-4">
        <label className="text-lg m-1" htmlFor="patientIdentifier">
          Patient Identifier
        </label>
        <div
          id="identifier-input-row"
          className="flex rounded-t-lg mb-4 justify-center"
        >
          <input
            type="text"
            id="patientIdentifier"
            name="patientIdentifier"
            placeholder="e.g. PatientMrn123"
            className="border border-slate-500 p-2 w-10/12"
            value={currentPatientQuery.identifier}
            onChange={handleIdentifierInputUpdate}
          />
        </div>
      </div>
      <div id="patient-identifier-system-section" className="mb-4">
        <label className="text-lg m-1" htmlFor="patientIdentifier">
          Identifier System
        </label>
        <div
          id="system-input-row"
          className="flex rounded-t-lg mb-4 justify-center"
        >
          <input
            type="text"
            id="patientIdSystem"
            name="patientIdSystem"
            placeholder="e.g. http://examplesystem.org/"
            className="border border-slate-500 p-2 w-10/12"
            value={currentPatientQuery.system}
            onChange={handleSystemInputUpdate}
          />
        </div>
      </div>
    </>
  );
}

export default PatientIdInput;
