function NameInput({ currentPatientQuery, setCurrentPatientQuery, nameType }) {
  /**
   * Update controlled state when input element is updated
   * @param {Event} e
   */
  function handleInputUpdate(e) {
    const value = e.target.value;
    const newPatientQuery = { ...currentPatientQuery };
    nameType === "Family"
      ? (newPatientQuery.familyName = value)
      : (newPatientQuery.givenName = value);
    setCurrentPatientQuery(newPatientQuery);
  }

  return (
    <div id="birthdate-section" className="mb-4">
      <label className="text-lg m-1" htmlFor="nameInput">
        {`${nameType} Name`}
      </label>
      <div id="id-input-row" className="flex rounded-t-lg mb-4 justify-center">
        <input
          type="text"
          id="patientIds"
          name="patientIds"
          placeholder={nameType === "Family" ? "e.g. Doe" : "e.g. John"}
          className="border border-slate-500 p-2 w-10/12"
          value={
            nameType === "Family"
              ? currentPatientQuery.familyName
              : currentPatientQuery.givenName
          }
          onChange={handleInputUpdate}
        />
      </div>
    </div>
  );
}

export default NameInput;
