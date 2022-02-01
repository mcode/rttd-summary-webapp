const fhirpath = require("fhirpath");

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

function mapCourseSummary(procedure) {
  let summary = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.meta.profile.first() = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-course-summary').resource"
  )[0];
  let output = {};
  output["Course Label"] = summary.identifier[0].value;
  let intent = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent').valueCodeableConcept.coding"
  )[0];
  output["Treatment Intent"] = `SCT#${intent.code} "${intent.display}"`;
  output["Start Date"] = summary.performedPeriod.start;
  output["End Date"] = summary.performedPeriod.end;
  let modality = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality').valueCodeableConcept.coding"
  )[0];
  output["Modalities"] = `SCT#${modality.code} "${modality.display}"`;
  let technique = fhirpath.evaluate(
    summary,
    "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique').extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique').valueCodeableConcept.coding"
  )[0];
  output["Techniques"] = `SCT#${technique.code} "${technique.display}"`;
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
    .map((coding) => `SCT#${coding.code} "${coding.display}"`);
  return output;
}

export { mapPatient, mapCourseSummary };
