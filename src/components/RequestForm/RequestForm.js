import FetchDataButton from "./FetchDataButton";
import FhirServerUrlInput from "./FhirServerUrlInput";
import PatientIdList from "./PatientIdList";
import PatientIdInput from "./PatientIdInput";

function RequestForm({
  makeRequests,
  setLoading,
  serverUrl,
  setServerUrl,
  patientIdInput,
  setPatientIdInput,
  patientIds,
  setPatientIds,
  setFetchedData,
}) {
  return (
    <form
      className="flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const resp = await makeRequests();
        setLoading(false);
        setFetchedData(resp);
      }}
    >
      {/* Input for the FHIR server URL */}
      <FhirServerUrlInput serverUrl={serverUrl} setServerUrl={setServerUrl} />
      {/* Input component for entering a list of patient ids */}
      <PatientIdInput
        patientIdInput={patientIdInput}
        setPatientIdInput={setPatientIdInput}
        patientIds={patientIds}
        setPatientIds={setPatientIds}
      />
      {patientIds.length > 0 && (
        <PatientIdList patientIds={patientIds} setPatientIds={setPatientIds} />
      )}
      <FetchDataButton />
    </form>
  );
}

export default RequestForm;
