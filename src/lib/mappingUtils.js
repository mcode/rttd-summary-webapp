const fhirpath = require("fhirpath");

/**
 * Takes a patient resource returned by makeRequests and returns a mapping of Patient data to be displayed in the table
 * @param {Object} patient - A patient resource
 * @returns {Object} Returns an object with key/value pairs of data to display in the table
 */
function mapPatient(patient) {
  const output = {};
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
  const summary = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.meta.profile contains 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-course-summary').resource"
  )[0];
  const output = {};
  output["Course Label"] = summary.identifier
    ? summary.identifier[0].value
    : "N/A";
  output["Treatment Status"] = summary.status;
  output["Treatment Intent"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent').valueCodeableConcept.coding.display"
  )[0];
  output["Start Date"] = summary.performedPeriod.start;
  output["End Date"] = summary.performedPeriod.end;
  output["Modalities"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding.display"
  )[0];
  output["Techniques"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding.display"
  )[0];
  output["Number of Sessions"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-sessions').valueUnsignedInt"
  )[0];
  output["Number of Delivered Fractions"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'fractionsDelivered').valueUnsignedInt"
  );
  output["Total Delivered Dose [cGy]"] = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'totalDoseDelivered').valueQuantity.value"
  );
  output["Body Sites"] = fhirpath.evaluate(
    summary,
    "Procedure.bodySite.coding.display"
  );
  return output;
}

/**
 * Takes a bundle of procedures and returns an array of mappings of TreatedPhase data to be displayed in the table
 * @param {Object} procedure - A bundle of procedures
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapTreatedPhase(procedure) {
  const phases = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.code.coding.code = 'USCRS-33527').resource"
  );
  const outputs = [];
  phases.forEach((phase) => {
    const output = {};
    output["Phase Label"] = phase.identifier
      ? phase.identifier[0].value
      : "N/A";
    output["Start Date"] = phase.performedPeriod.start;
    output["End Date"] = phase.performedPeriod.end;
    output["Modalities"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding.display"
    )[0];
    output["Techniques"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding.display"
    )[0];
    output["Number of Fractions Delivered"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-fractions-delivered').valueUnsignedInt"
    )[0];
    output["Total Dose Delivered [cGy]"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'totalDoseDelivered').valueQuantity.value"
    );
    output["Body Sites"] = fhirpath.evaluate(
      phase,
      "Procedure.bodySite.coding.display"
    );
    outputs.push(output);
  });
  return outputs;
}

/**
 * Takes a bundle of serviceRequests and returns an array of mappings of Phase data to be displayed in the table
 * Based on https://build.fhir.org/ig/HL7/codex-radiation-therapy/StructureDefinition-codexrt-radiotherapy-planned-phase.html
 * @param {Object} procedure - A bundle of serviceRequests
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapPlannedTreatmentPhases(serviceRequests) {
  const plannedPhases = fhirpath.evaluate(
    serviceRequests,
    "Bundle.entry.where(resource.code.coding.code = 'USCRS-33527').resource"
  );
  const outputs = [];
  plannedPhases.forEach((plannedPhase) => {
    const output = {};
    output["Planned Phase Label"] = plannedPhase.identifier
      ? plannedPhase.identifier[0].value
      : "N/A";
    output["Phase Status"] = plannedPhase.status;
    output["Request Intent"] = plannedPhase.intent;
    // IG states there will be at most one procedure intent
    output["Modalities"] = fhirpath.evaluate(
      plannedPhase,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding.display"
    )[0];
    output["Techniques"] = fhirpath.evaluate(
      plannedPhase,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding.display"
    )[0];
    output["Planned Number of Fractions"] = fhirpath.evaluate(
      plannedPhase,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-fractions-planned').valuePositiveInt"
    )[0];
    output["Planned Dose per Fraction [cGy]"] = fhirpath.evaluate(
      plannedPhase,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-dose-planned-to-volume').extension.where(url = 'fractionDose').valueQuantity.value"
    );
    output["Total Planned Dose [cGy]"] = fhirpath.evaluate(
      plannedPhase,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-dose-planned-to-volume').extension.where(url = 'totalDose').valueQuantity.value"
    );
    output["Body Sites"] = fhirpath.evaluate(
      plannedPhase,
      "ServiceRequest.bodySite.coding.display"
    );
    outputs.push(output);
  });
  return outputs;
}

/**
 * Takes a bundle of serviceRequests returned and returns an array of mappings of PlannedCourse data to be displayed in the table
 * Based on https://build.fhir.org/ig/HL7/codex-radiation-therapy/StructureDefinition-codexrt-radiotherapy-planned-course.html
 * @param {Object} procedure - A bundle of serviceRequests
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapPlannedCourses(serviceRequests) {
  const plannedCourses = fhirpath.evaluate(
    serviceRequests,
    "Bundle.entry.where(resource.code.coding.code = 'USCRS-33529').resource"
  );
  const outputs = [];
  plannedCourses.forEach((plannedCourse) => {
    const output = {};
    output["Course Label"] = plannedCourse.identifier
      ? plannedCourse.identifier[0].value
      : "N/A";
    output["Course Status"] = plannedCourse.status;
    output["Request Intent"] = plannedCourse.intent;
    // IG states there will be at most one procedure intent
    output["Procedure Intent"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent').valueCodeableConcept.single().coding.display"
    )[0];
    // One display value should suffice
    output["Modalities"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding.display"
    )[0];
    // One display value should suffice
    output["Techniques"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding.display"
    )[0];
    // IG states there will be at most one value for # sessions
    output["Number of Sessions"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-sessions').valueUnsignedInt.single()"
    )[0];
    output["Number of Planned Fractions"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-dose-planned-to-volume').extension.where(url = 'fractions').valuePositiveInt"
    );
    output["Total Planned Dose [cGy]"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-dose-planned-to-volume').extension.where(url = 'totalDose').valueQuantity.value"
    );
    output["Body Sites"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.bodySite.coding.display"
    );
    //NOT included yet
    // output["Energy or Isotope"]
    // output["Treatment Device"]

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
  const bodyStructures = fhirpath.evaluate(volumes, "Bundle.entry.resource");
  const outputs = [];
  bodyStructures.forEach((volume) => {
    const output = {};
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

export {
  mapPatient,
  mapCourseSummary,
  mapTreatedPhase,
  mapVolumes,
  mapPlannedCourses,
  mapPlannedTreatmentPhases,
};
