import BirthDateInput from "./BirthDateInput";
import PatientIdInput from "./PatientIdInput";
import NameInput from "./NameInput";
import GenderInput from "./GenderInput";

function RequestForm({
  currentPatientQuery,
  setCurrentPatientQuery,
  patientQueries,
  setPatientQueries,
  setDisplay,
  currentPatientQueryIdx,
  setCurrentPatientQueryIdx,
}) {
  function handleClose() {
    setCurrentPatientQuery({});
    setCurrentPatientQueryIdx(undefined);
    setDisplay(false);
  }

  function saveQuery() {
    if (currentPatientQueryIdx !== 0) {
      const beforeChanges = patientQueries.slice(0, currentPatientQueryIdx);
      const afterChanges = patientQueries.slice(
        currentPatientQueryIdx + 1,
        patientQueries.length
      );
      setPatientQueries([
        ...beforeChanges,
        currentPatientQuery,
        ...afterChanges,
      ]);
      handleClose();
    } else if (currentPatientQueryIdx === 0) {
      patientQueries.shift();
      setPatientQueries([currentPatientQuery, ...patientQueries]);
      handleClose();
    } else {
      setPatientQueries([...patientQueries, currentPatientQuery]);
      handleClose();
    }
  }
  return (
    <>
      <div className="grid place-items-center absolute inset-0 outline-none overflow-x-hidden overflow-y-auto bg-gray-400/50">
        <div className="lg:w-4/12 p-3 rounded-lg border-black bg-white">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
            }}
          >
            <BirthDateInput
              currentPatientQuery={currentPatientQuery}
              setCurrentPatientQuery={setCurrentPatientQuery}
            />
            <PatientIdInput
              currentPatientQuery={currentPatientQuery}
              setCurrentPatientQuery={setCurrentPatientQuery}
            />
            <NameInput
              currentPatientQuery={currentPatientQuery}
              setCurrentPatientQuery={setCurrentPatientQuery}
              nameType="Given"
            />
            <NameInput
              currentPatientQuery={currentPatientQuery}
              setCurrentPatientQuery={setCurrentPatientQuery}
              nameType="Family"
            />
            <GenderInput
              currentPatientQuery={currentPatientQuery}
              setCurrentPatientQuery={setCurrentPatientQuery}
            />
          </form>
          <div className="flex justify-center items-center">
            <button
              className="mx-2 border border-gray-400 px-1 hover:bg-slate-200 cursor-pointer transition-all shadow-lg active:shadow bg-slate-100"
              type="button"
              onClick={saveQuery}
            >
              Save Query
            </button>
            <button
              type="button"
              className="mx-2 border border-gray-400 px-1 hover:bg-red-300 cursor-pointer transition-all shadow-lg active:shadow bg-red-200"
              onClick={(e) => {
                handleClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestForm;
