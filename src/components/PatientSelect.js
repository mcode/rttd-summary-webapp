function PatientSelect({ options, value, setValue }) {
  function handleChange(event) {
    console.log(event.target.value);
    setValue(event.target.value);
  }
  console.log(options);
  return (
    <select value={value} onChange={handleChange}>
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  );
}

export default PatientSelect;
