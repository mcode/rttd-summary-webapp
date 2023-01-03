function BirthDateInput({ currentPatientQuery, setCurrentPatientQuery }) {
  /**
   * Update controlled state when input element is updated
   * @param {Event} e
   */
  function handleInputUpdate(e) {
    const value = e.target.value;
    setCurrentPatientQuery({ ...currentPatientQuery, birthDate: value });
  }

  return (
    <div id="birthdate-section" className="mb-4">
      <label className="text-lg m-1" htmlFor="birthDateInput">
        Birth Date
      </label>
      <div id="id-input-row" className="flex rounded-t-lg mb-4 justify-center">
        <input
          type="date"
          id="birthdate"
          name="birthDate"
          className="border border-slate-500 p-2 w-10/12"
          value={currentPatientQuery.birthDate}
          onChange={handleInputUpdate}
        />
      </div>
    </div>
  );
}

export default BirthDateInput;
