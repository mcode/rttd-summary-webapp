import _, { isBoolean } from "lodash";
import { DateTime } from "luxon";
import EmptyComponent from "../components/DataView/EmptyComponent";

function dateFormat(data) {
  const dateObj = DateTime.fromISO(data);

  const localeOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  /* 
  The inclusion of T in the DateTime indicates a time is included. We don't 
  want to include a minute and hour in our options otherwise, as a time of
  12:00 AM will be returned when no time is present
  */
  if (data.includes("T")) {
    localeOptions.hour = "2-digit";
    localeOptions.minute = "2-digit";
  }

  // Include a time zone if we have a time, no time zone otherwise
  return `${dateObj.toLocaleString(localeOptions)}${
    data.includes("T") ? " " + dateObj.offsetNameShort : ""
  }`;
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

function dataDisplay(data) {
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
