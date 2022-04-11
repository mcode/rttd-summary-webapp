function GenderInput({ currentPatientQuery, setCurrentPatientQuery }) {
  /**
   * Update controlled state when input element is updated
   * @param {Event} e
   */
  function handleInputUpdate(e) {
    const value = e.target.value.toLowerCase();
    let queryGender =
      currentPatientQuery.gender && currentPatientQuery.gender === value
        ? undefined
        : value;
    setCurrentPatientQuery({
      ...currentPatientQuery,
      gender: queryGender,
    });
  }

  const GENDER_OPTIONS = ["Male", "Female", "Other", "Unknown"];

  return (
    <div id="gender-section" className="mb-4">
      <label className="text-lg m-1" htmlFor="genderInput">
        Gender
      </label>
      <div
        id="gender-checkboxes"
        className="flex rounded-t-lg mb-4 space-x-4 justify-center"
      >
        {GENDER_OPTIONS.map((option) => (
          <div key={option} className="space-x-1">
            <input
              type="checkbox"
              id={option}
              name="gender"
              key={option}
              value={option}
              onChange={handleInputUpdate}
              checked={currentPatientQuery.gender === option.toLowerCase()}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenderInput;
