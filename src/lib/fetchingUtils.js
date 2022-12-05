import axios from "axios";

/**
 * Takes an array of patient query URLS and fetches FHIR resources for each of them
 * @param {String[]} patientQueries - An array of query urls to perform GET requests on
 * @param {Object} requestHeaders - An object containing request headers to be included in each GET request
 * @returns {Object[]} Returns an array of FHIR patient resources
 */
async function fetchPatients(patientQueries, requestHeaders) {
  let patientResourceArray = [];

  for (const query of patientQueries) {
    await axios
      .get(query, { headers: requestHeaders })
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

  let identifierPresent = false;
  queryParams.forEach((param, idx) => {
    const seperator = idx === 0 ? "?" : "&";

    switch (param) {
      case "id":
        urlStr += `${seperator}_id=${queryObj[param]}`;
        break;
      case "identifier":
        if (!identifierPresent) {
          if (queryObj.system) {
            urlStr += `${seperator}identifier=${queryObj.system}%7C${queryObj[param]}`;
          } else {
            urlStr += `${seperator}identifier=${queryObj[param]}`;
          }
          identifierPresent = true;
        }
        break;
      case "system":
        if (!identifierPresent) {
          if (!queryObj.identifier) {
            urlStr += `${seperator}identifier=${queryObj[param]}%7C`;
          } else {
            urlStr += `${seperator}identifier=${queryObj[param]}%7C${queryObj.identifier}`;
          }
          identifierPresent = true;
        }
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
 * @param {String} severUrl - The base sever URL
 * @param {String} patientId - A patient ID to fetch Procedure resources for
 * @param {Object} requestHeaders - An object containing request headers to be included in each GET request
 * @returns {Object[]} Returns an array of FHIR Procedure resources for that Patient
 */
async function fetchProcedures(serverUrl, patientId, requestHeaders) {
  const procedureResources = await axios
    .get(`${serverUrl}/Procedure?subject:Patient=${patientId}`, {
      headers: requestHeaders,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return procedureResources;
}

/**
 * Takes a patient ID and fetches RTTD Volumes resources that patient
 * @param {String} severUrl - The base sever URL
 * @param {String} patientId - A patient ID to fetch Procedure resources for
 * @param {Object} requestHeaders - An object containing request headers to be included in each GET request
 * @returns {Object[]} Returns an array of FHIR BodyStructure resources for that Patient
 */
async function fetchVolumes(serverUrl, patientId, requestHeaders) {
  const volumeResources = await axios
    .get(`${serverUrl}/BodyStructure?patient:Patient=${patientId}`, {
      headers: requestHeaders,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return volumeResources;
}

/**
 * Takes a patient ID and fetches ServiceRequest resources that patient
 * @param {String} severUrl - The base sever URL
 * @param {String} patientId - A patient ID to fetch ServiceRequest resources for
 * @param {Object} requestHeaders - An object containing request headers to be included in each GET request
 * @returns {Object[]} Returns an array of FHIR ServiceRequest resources for that Patient
 */
async function fetchServiceRequests(serverUrl, patientId, requestHeaders) {
  const serviceRequests = await axios
    .get(`${serverUrl}/ServiceRequest?subject:Patient=${patientId}`, {
      headers: requestHeaders,
    })
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
