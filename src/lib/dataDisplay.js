import _, { isBoolean } from "lodash";
import { DateTime } from "luxon";
import EmptyComponent from "../components/DataView/EmptyComponent";

function dateFormat(data) {
  return DateTime.fromISO(data).toLocaleString({
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function booleanFormat(data) {
  return data ? "True" : "False";
}

function isDate(data) {
  // Dates and Datetimes are JSON strings according to FHIR Datatype spec
  // https://www.hl7.org/fhir/datatypes.html#date
  return typeof data === "string" && DateTime.fromISO(data).isValid;
}

function isEmpty(data) {
  return _.isUndefined(data) || _.isNull(data);
}

function dataDisplay(data, type) {
  if (isEmpty(data)) {
    // Always check for empty data
    return <EmptyComponent />;
  } else if (isBoolean(data)) {
    return booleanFormat(data);
  } else if (isDate(data)) {
    return dateFormat(data);
  } else {
    return data;
  }
}

export { dataDisplay };
