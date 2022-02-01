import { v5 as uuidv5 } from "uuid";

// UUID v4 Namespace generated with https://www.uuidgenerator.net/version4
const NAMESPACE = "8b10bce9-fb6e-4897-89e3-aa2e234cb767";

function hashData(data) {
  return uuidv5(JSON.stringify(data), NAMESPACE);
}

export { hashData };
