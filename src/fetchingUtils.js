import axios from "axios";

/**
 * Takes an array of patient IDs and fetches FHIR resources for each of them
 * @param {String[]} patientIdArray - An array of patient Ids to fetch resources for
 * @returns {Object[]} Returns an array of FHIR patient resources
 */
async function fetchPatients(serverUrl, patientIdArray) {
  let patientResourceArray = [];

  for (const patientId of patientIdArray) {
    let patientResource = await axios
      .get(`${serverUrl}/Patient?_id=${patientId}`)
      .then((res) => res.data.entry[0].resource)
      .catch((e) => {
        console.error(e);
      });
    patientResourceArray.push(patientResource);
  }

  return patientResourceArray;
}

/**
 * Takes a patient ID and fetches RTTD Procedure resources that patient
 * @param {String} patientId - A patient ID to fetch Procedure resources for
 * @returns {Object[]} Returns an array of FHIR Procedure resources for that Patient
 */
async function fetchProcedures(serverUrl, patientId) {
  let procedureResources = await axios
    .get(`${serverUrl}/Procedure?subject:Patient=${patientId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return procedureResources;
}

/**
 * Takes a patient ID and fetches RTTD Volumes resources that patient
 * @param {String} patientId - A patient ID to fetch Procedure resources for
 * @returns {Object[]} Returns an array of FHIR BodyStructure resources for that Patient
 */
async function fetchVolumes(serverUrl, patientId) {
  // TODO: Determine why this is a body structure and
  //       if we need to filter out non-volume BodyStructure resources
  let volumeResources = await axios
    .get(`${serverUrl}/BodyStructure?patient:Patient=${patientId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return volumeResources;
}

export { fetchPatients, fetchProcedures, fetchVolumes };
