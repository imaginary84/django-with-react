export function parseErrorMessages(fieldsErrorMessages) {
  return Object.entries(fieldsErrorMessages).reduce(
    (acc, [fieldName, errors]) => {
      // errors -> ["message", "message2"]
      acc[fieldName] = {
        validateStatus: "error",
        help: Array.isArray(errors) ? errors.join(" ") : errors,
      };
      return acc;
    },
    {}
  );
}
