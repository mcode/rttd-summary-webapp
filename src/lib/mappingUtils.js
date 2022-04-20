const fhirpath = require("fhirpath");

/**
 * Takes a patient resource returned by makeRequests and returns a mapping of Patient data to be displayed in the table
 * @param {Object} patient - A patient resource
 * @returns {Object} Returns an object with key/value pairs of data to display in the table
 */
function mapPatient(patient) {
  let output = {};
  output["ID"] = patient.identifier[0].value;
  output["First Name"] = patient.name[0].given.join(" ");
  output["Last Name"] = patient.name[0].family;
  output["Date of Birth"] = patient.birthDate;
  output["Administrative Gender"] = patient.gender;
  output["Birth Sex"] = patient.extension[0].valueCode;
  return output;
}

/**
 * Takes a bundle of procedures returned by makeRequests and returns a mapping of Course Summary data to be displayed in the table
 * @param {Object} procedure - A bundle of procedures
 * @returns {Object} Returns an object with key/value pairs of data to display in the table
 */
function mapCourseSummary(procedure) {
  let summary = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.meta.profile.first() = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-course-summary').resource"
  )[0];
  let output = {};
  output["Course Label"] = summary.identifier
    ? summary.identifier[0].value
    : "N/A";
  output["Treatment Status"] = summary.status;
  let intent = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent').valueCodeableConcept.coding"
  )[0];
  output["Treatment Intent"] = intent ? intent.display : undefined;
  output["Start Date"] = summary.performedPeriod.start;
  output["End Date"] = summary.performedPeriod.end;
  let modality = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding"
  )[0];
  output["Modalities"] = modality ? modality.display : undefined;
  let technique = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding"
  )[0];
  output["Techniques"] = technique ? technique.display : undefined;
  output["Number of Sessions"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-sessions').valueUnsignedInt"
  )[0];
  output["Number of Delivered Fractions"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'fractionsDelivered').valueUnsignedInt"
  );
  output["Total Delivered Dose to Course [cGy]"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'totalDoseDelivered').valueQuantity.value"
  );
  output["Body Sites"] = fhirpath
    .evaluate(summary, "Procedure.bodySite.coding")
    .map((coding) => coding.display);
  return output;
}

/**
 * Takes a bundle of procedures returned by makeRequests and returns an array of mappings of Phase data to be displayed in the table
 * @param {Object} procedure - A bundle of procedures
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapPhase(procedure) {
  let phases = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.meta.profile.first() = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-treatment-phase').resource"
  );
  let outputs = [];
  phases.forEach((phase) => {
    let output = {};
    output["Phase Label"] = phase.identifier
      ? phase.identifier[0].value
      : "N/A";
    output["Start Date"] = phase.performedPeriod.start;
    output["End Date"] = phase.performedPeriod.end;
    let modality = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding"
    )[0];
    output["Modalities"] = modality ? modality.display : undefined;
    let technique = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding"
    )[0];
    output["Techniques"] = technique ? technique.display : undefined;
    output["Number of Fractions Delivered"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-fractions-delivered').valueUnsignedInt"
    )[0];
    output["Total Dose Delivered from Phase [cGy]"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'totalDoseDelivered').valueQuantity.value"
    );
    outputs.push(output);
  });
  return outputs;
}

/**
 * Takes a bundle of body structures returned by makeRequests and returns an array of mappings of Volume data to be displayed in the table
 * @param {Object} volumes - A bundle of radiotherapy volume body structures
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapVolumes(volumes) {
  let bodyStructures = fhirpath.evaluate(volumes, "Bundle.entry.resource");
  let outputs = [];
  bodyStructures.forEach((volume) => {
    let output = {};
    output["Volume Label"] = fhirpath.evaluate(
      volume,
      "BodyStructure.identifier.where(use = 'usual').value"
    )[0];
    output["Type"] = volume.morphology
      ? volume.morphology.coding[0].display
      : undefined;
    output["Location"] = volume.location
      ? volume.location.coding[0].display
      : undefined;
    output["Location Qualifier"] = volume.locationQualifier
      ? volume.locationQualifier[0].coding[0].display
      : undefined;
    outputs.push(output);
  });
  return outputs;
}

export { mapPatient, mapCourseSummary, mapPhase, mapVolumes };
