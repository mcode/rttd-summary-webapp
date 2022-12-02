const fhirpath = require("fhirpath");

// Some common getters with complex FHIRpaths
function getProcedureIntent(resource, resourceType) {
  return fhirpath.evaluate(
    resource,
    `${resourceType}.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent').valueCodeableConcept.single().coding.display`
  )[0];
}
function getModalities(resource, resourceType) {
  const extensions = fhirpath.evaluate(
    resource,
    `${resourceType}.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality-and-technique')`
  );

  return extensions.map((extension) => {
    return {
      Modality: extension.extension?.find(
        (extension) =>
          extension.url ===
          "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-modality"
      )?.valueCodeableConcept?.coding[0]?.display,
      Techniques: extension.extension
        ?.filter(
          (extension) =>
            extension.url ===
            "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-technique"
        )
        .map((techniqueObj) => {
          return techniqueObj.valueCodeableConcept.coding[0].display;
        })
        .join("\n"),
    };
  });
}
function getBodySites(resource, resourceType) {
  return fhirpath.evaluate(resource, `${resourceType}.bodySite.coding.display`);
}
function getIdentifiers(patient) {
  const identifiers = [];
  patient?.identifier?.forEach((identifier) => {
    const idType = identifier.type?.coding?.[0].display;
    const idSystem = identifier.system;
    const idValue = identifier.value;
    identifiers.push(
      `${idType ?? "No Type"} : ${idSystem ?? "No System"} : ${
        idValue ?? "No Value"
      }`
    );
  });
  return identifiers.join(", ");
}
function getMetadata(resource) {
  const metadata = {};
  metadata["Resource ID"] = resource?.id;
  metadata["Version ID"] = resource?.meta?.versionId;
  metadata["Last Updated"] = resource?.meta?.lastUpdated;
  return metadata;
}

/**
 * Takes a patient resource returned by makeRequests and returns a mapping of Patient data to be displayed in the table
 * @param {Object} patient - A patient resource
 * @returns {Object} Returns an object with key/value pairs of data to display in the table
 */
function mapPatient(patient, includeMetadata = true) {
  const output = {};
  output["Identifier"] = getIdentifiers(patient);
  output["First Name"] = patient?.name?.[0]?.given.join(" ");
  output["Last Name"] = patient?.name?.[0]?.family;
  output["Date of Birth"] = patient?.birthDate;
  output["Administrative Gender"] = patient?.gender;
  output["Birth Sex"] = "N/A"; //patient?.extension[0].valueCode;
  return {
    ...output,
    ...(includeMetadata ? { metadata: getMetadata(patient) } : {}),
  };
}

/**
 * Takes a bundle of procedures returned by makeRequests and returns a mapping of Course Summary data to be displayed in the table
 * @param {Object} procedure - A bundle of procedures
 * @returns {Object} Returns an object with key/value pairs of data to display in the table
 */
function mapCourseSummary(procedure, includeMetadata = true) {
  const summaries = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.code.coding.code in ('USCRS-33529' | '1217123003')).resource"
  );
  const outputs = [];
  summaries.forEach((summary) => {
    const output = {};
    const courseIdentifier = getUsualIdentifier(summary)[0];
    output["Course Label"] = courseIdentifier?.value ?? "N/A";
    output["Diagnosis"] = fhirpath.evaluate(
      summary,
      "Procedure.reasonCode.coding.display"
    )[0];
    output["Treatment Status"] = summary?.status;
    output["Treatment Intent"] = getProcedureIntent(summary, "Procedure");
    output["Start Date"] = summary?.performedPeriod?.start;
    output["End Date"] = summary?.performedPeriod?.end;
    output["Modalities"] = getModalities(summary, "Procedure");
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
    output["Volume Label"] = fhirpath.evaluate(
      summary,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'volume').valueReference.display"
    );
    output["Body Sites"] = getBodySites(summary, "Procedure");
    outputs.push({
      ...output,
      ...(includeMetadata ? { metadata: getMetadata(summary) } : {}),
    });
  });
  return outputs;
}

/**
 * Takes a bundle of procedures and returns an array of mappings of TreatedPhase data to be displayed in the table
 * @param {Object} procedure - A bundle of procedures
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapTreatedPhase(procedure, includeMetadata = true) {
  const phases = fhirpath.evaluate(
    procedure,
    "Bundle.entry.where(resource.code.coding.code in ('USCRS-33527' | '1222565005')).resource"
  );
  const outputs = [];
  phases.forEach((phase) => {
    const output = {};
    output["Phase Label"] = phase?.identifier?.[0]?.value ?? "N/A";
    output["Phase Status"] = phase?.status;
    output["Start Date"] = phase?.performedPeriod?.start;
    output["End Date"] = phase?.performedPeriod?.end;
    output["Modalities"] = getModalities(phase, "Procedure");
    output["Number of Fractions Delivered"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-fractions-delivered').valueUnsignedInt"
    )[0];
    output["Total Dose Delivered [cGy]"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'totalDoseDelivered').valueQuantity.value"
    );
    output["Volume Label"] = fhirpath.evaluate(
      phase,
      "Procedure.extension.where(url = 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-radiotherapy-dose-delivered-to-volume').extension.where(url = 'volume').valueReference.display"
    );
    output["Body Sites"] = getBodySites(phase, "Procedure");
    outputs.push({
      ...output,
      ...(includeMetadata ? { metadata: getMetadata(phase) } : {}),
    });
  });
  return outputs;
}

/**
 * Takes a bundle of serviceRequests and returns an array of mappings of Phase data to be displayed in the table
 * Based on https://build.fhir.org/ig/HL7/codex-radiation-therapy/StructureDefinition-codexrt-radiotherapy-planned-phase.html
 * @param {Object} serviceRequests - A bundle of serviceRequests
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapPlannedTreatmentPhases(serviceRequests, includeMetadata = true) {
  const plannedPhases = fhirpath.evaluate(
    serviceRequests,
    "Bundle.entry.where(resource.code.coding.code in ('USCRS-33527' | '1222565005')).resource"
  );
  const outputs = [];
  plannedPhases.forEach((plannedPhase) => {
    const output = {};
    output["Planned Phase Label"] =
      plannedPhase?.identifier?.[0]?.value ?? "N/A";
    output["Phase Status"] = plannedPhase?.status;
    output["Request Intent"] = plannedPhase?.intent;
    // IG states there will be at most one procedure intent
    output["Modalities"] = getModalities(plannedPhase, "ServiceRequest");
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
    output["Volume Label"] = fhirpath.evaluate(
      plannedPhase,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-dose-planned-to-volume').extension.where(url = 'volume').valueReference.display"
    );
    output["Body Sites"] = getBodySites(plannedPhase, "ServiceRequest");
    outputs.push({
      ...output,
      ...(includeMetadata ? { metadata: getMetadata(plannedPhase) } : {}),
    });
  });
  return outputs;
}

/**
 * Takes a bundle of serviceRequests returned and returns an array of mappings of PlannedCourse data to be displayed in the table
 * Based on https://build.fhir.org/ig/HL7/codex-radiation-therapy/StructureDefinition-codexrt-radiotherapy-planned-course.html
 * @param {Object} serviceRequests - A bundle of serviceRequests
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapPlannedCourses(serviceRequests, includeMetadata = true) {
  const plannedCourses = fhirpath.evaluate(
    serviceRequests,
    "Bundle.entry.where(resource.code.coding.code in ('USCRS-33529' |  '1217123003' )).resource"
  );
  const outputs = [];
  plannedCourses.forEach((plannedCourse) => {
    const output = {};
    const courseIdentifier = getUsualIdentifier(plannedCourse)[0];
    output["Course Label"] = courseIdentifier?.value ?? "N/A";
    output["Course Status"] = plannedCourse?.status;
    output["Request Intent"] = plannedCourse?.intent;
    // IG states there will be at most one procedure intent
    output["Procedure Intent"] = getProcedureIntent(
      plannedCourse,
      "ServiceRequest"
    );
    // One display value should suffice
    output["Modalities"] = getModalities(plannedCourse, "ServiceRequest");
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
    output["Volume Label"] = fhirpath.evaluate(
      plannedCourse,
      "ServiceRequest.extension.where(url = 'http://hl7.org/fhir/us/codex-radiation-therapy/StructureDefinition/codexrt-radiotherapy-dose-planned-to-volume').extension.where(url = 'volume').valueReference.display"
    );
    output["Body Sites"] = getBodySites(plannedCourse, "ServiceRequest");
    //NOT included yet
    // output["Energy or Isotope"]
    // output["Treatment Device"]

    outputs.push({
      ...output,
      ...(includeMetadata ? { metadata: getMetadata(plannedCourse) } : {}),
    });
  });
  return outputs;
}

/**
 * Takes a bundle of body structures returned by makeRequests and returns an array of mappings of Volume data to be displayed in the table
 * @param {Object} volumes - A bundle of radiotherapy volume body structures
 * @returns {Object[]} Returns an array of objects with key/value pairs of data to display in the table
 */
function mapVolumes(volumes, includeMetadata = true) {
  const bodyStructures = fhirpath.evaluate(volumes, "Bundle.entry.resource");
  const outputs = [];
  bodyStructures.forEach((volume) => {
    const output = {};
    output["Volume Label"] = fhirpath.evaluate(
      volume,
      "BodyStructure.identifier.where(use = 'usual').value"
    )[0];
    output["Type"] = volume?.morphology?.coding?.[0]?.display ?? undefined;
    output["Location"] = volume?.location?.coding?.[0]?.display ?? undefined;
    output["Location Qualifier"] =
      volume?.locationQualifier?.[0]?.coding?.[0]?.display ?? undefined;
    outputs.push({
      ...output,
      ...(includeMetadata ? { metadata: getMetadata(volume) } : {}),
    });
  });
  return outputs;
}

/**
 *  Return the identifier of an object where the use attribute is == to 'usual'
 * @param {Object} obj the object to evaluate against
 * @returns {Object[] } an array of identifiers
 */
function getUsualIdentifier(obj) {
  return fhirpath.evaluate(obj, "identifier.where(use='usual')");
}
export {
  mapPatient,
  mapCourseSummary,
  mapTreatedPhase,
  mapVolumes,
  mapPlannedCourses,
  mapPlannedTreatmentPhases,
};
