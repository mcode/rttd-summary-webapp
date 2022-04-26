import axios from "axios";

/**
 * Takes an array of patient query URLS and fetches FHIR resources for each of them
 * @param {String[]} patientQueries - An array of query urls to perform GET requests on
 * @returns {Object[]} Returns an array of FHIR patient resources
 */
async function fetchPatients(patientQueries) {
  let patientResourceArray = [];

  for (const query of patientQueries) {
    await axios
      .get(query)
      .then((res) => {
        res.data.entry.forEach((entry) => {
          if (
            !patientResourceArray.some(
              (resource) => resource.id === entry.resource.id
            )
          ) {
            patientResourceArray.push(entry.resource);
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }
  return patientResourceArray;
}

/**
 * Takes an array of patient query objects and generates search urls
 * @param {String} serverUrl - The base server url
 * @param {Object} queryObj - An object containing query parameters to search on
 * @returns {String[]} Returns an array of FHIR search Urls
 */
function generateQueryUrl(serverUrl, queryObj) {
  let urlStr = `${serverUrl}/Patient`;
  const queryParams = Object.keys(queryObj).filter((key) => queryObj[key]);

  if (queryParams.length === 0) return;

  queryParams.forEach((param, idx) => {
    const seperator = idx === 0 ? "?" : "&";

    switch (param) {
      case "id":
        urlStr += `${seperator}_id=${queryObj[param]}`;
        break;
      case "givenName":
        urlStr += `${seperator}given:exact=${queryObj[param]}`;
        break;
      case "familyName":
        urlStr += `${seperator}family:exact=${queryObj[param]}`;
        break;
      case "birthDate":
        urlStr += `${seperator}birthdate=${queryObj[param]}`;
        break;
      case "gender":
        urlStr += `${seperator}gender=${queryObj[param]}`;
        break;
      default:
        break;
    }
  });
  return urlStr;
}

/**
 * Takes a patient ID and fetches RTTD Procedure resources that patient
 * @param {String} patientId - A patient ID to fetch Procedure resources for
 * @returns {Object[]} Returns an array of FHIR Procedure resources for that Patient
 */
async function fetchProcedures(serverUrl, patientId) {
  const procedureResources = await axios
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
  const volumeResources = await axios
    .get(`${serverUrl}/BodyStructure?patient:Patient=${patientId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return volumeResources;
}

/**
 * Takes a patient ID and fetches ServiceRequest resources that patient
 * @param {String} patientId - A patient ID to fetch ServiceRequest resources for
 * @returns {Object[]} Returns an array of FHIR ServiceRequest resources for that Patient
 */
async function fetchServiceRequests(serverUrl, patientId) {
  const serviceRequests = await axios
    .get(`${serverUrl}/ServiceRequest?subject:Patient=${patientId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return serviceRequests;
}

export {
  fetchPatients,
  fetchProcedures,
  fetchVolumes,
  fetchServiceRequests,
  generateQueryUrl,
};
