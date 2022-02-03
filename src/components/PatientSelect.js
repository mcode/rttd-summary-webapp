function PatientSelect({ options, value, setValue }) {
  function handleChange(event) {
    setValue(event.target.value);
  }
  return (
    <div className="flex flex-col">
      <label htmlFor="patientSelect" className="font-light text-left text-sm">
        Patient Selection
      </label>
      <select
        id="patientSelect"
        value={value}
        onChange={handleChange}
        className="block my-1 p-2 rounded border border-gray-300 bg-slate-100 font-light"
      >
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PatientSelect;
