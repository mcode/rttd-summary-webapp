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

function isDate(data) {
  return DateTime.fromISO(data).isValid;
}

function isEmpty(data) {
  return _.isUndefined(data) || _.isNull(data);
}

function dataDisplay(data) {
  if (isEmpty(data)) {
    return <EmptyComponent />;
  } else if (isBoolean(data)) {
    return data ? "True" : "False";
  } else if (isDate(data)) {
    return dateFormat(data);
  } else {
    return data;
  }
}

export { dataDisplay };
