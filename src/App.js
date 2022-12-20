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
      <div className="w-full px-4 md:px-8 grid grid-cols-4 mt-4">
        <RequestConfigurationPanel
          setResourceMap={setResourceMap}
          setSearchedPatientIds={setSearchedPatientIds}
          setLoading={setLoading}
        />
        <div className="col-span-4 md:col-span-3 ml-0 md:ml-2">
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
