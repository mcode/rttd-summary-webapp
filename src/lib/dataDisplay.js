import _ from "lodash";
import { DateTime } from "luxon";
import EmptyComponent from "../components/EmptyComponent";

function dateFormat(data) {
  return DateTime.fromISO(data).toLocaleString();
}

function isDate(data) {
  return DateTime.fromISO(data).isValid;
}

function isEmpty(data) {
  return _.isUndefined(data) || _.isNull(data);
}

function dataDisplay(data) {
  if (isDate(data)) {
    return dateFormat(data);
  } else if (isEmpty(data)) {
    return <EmptyComponent />;
  } else {
    return data;
  }
}

export { dataDisplay };
