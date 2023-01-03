function FhirServerUrlInput({ serverUrl, setServerUrl }) {
  function handleChange(e) {
    const value = e.target.value;
    setServerUrl(value);
  }
  return (
    <>
      <label className="text-lg mb-1 block" htmlFor="serverUrl">
        FHIR Server URL
      </label>
      <input
        type="url"
        id="serverUrl"
        name="serverUrl"
        placeholder="https://api.logicahealth.org/RTTD/open"
        pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)"
        className="border border-slate-500 w-full p-2"
        value={serverUrl}
        onChange={handleChange}
      />
    </>
  );
}

export default FhirServerUrlInput;
