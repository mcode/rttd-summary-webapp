import { useState } from "react";
// components
import DataView from "./components/DataView/DataView";
import Header from "./components/Header";
import LoadingAnimation from "./components/LoadingAnimation";
import RequestConfigurationPanel from "./components/RequestConfiguration/RequestConfigurationPanel";

function App() {
  // Regular useState
  const [loading, setLoading] = useState(false);
  const [resourceMap, setResourceMap] = useState(new Map());
  const [searchedPatientIds, setSearchedPatientIds] = useState([]);

  return (
    <>
      <Header />
      <div className="container grid grid-cols-4 sm:mx-auto px-4 sm:px-0 mt-4">
        <RequestConfigurationPanel
          setResourceMap={setResourceMap}
          setSearchedPatientIds={setSearchedPatientIds}
          setLoading={setLoading}
        />
        <div className="col-span-4 sm:col-span-3 ml-0 sm:ml-2">
          {loading && <LoadingAnimation />}

          {resourceMap && (
            <DataView
              resourceMap={resourceMap}
              key={searchedPatientIds}
              patientIds={searchedPatientIds}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
