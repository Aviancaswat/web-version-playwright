//Utils
import { formatDate } from "./formatDate";

//Types
import type { FormDataNormalizerParams } from "./formDataNormalizer.types";

export const formDataNormalizer = ({
  data,
  stepFields,
  type,
}: FormDataNormalizerParams) => {
  const result = { ...data };

  switch (type) {
    case "new":
      Object.keys(data).forEach((key) => {
        const value = result[key];
        if (value === "true") result[key] = true;
        else if (value === "false") result[key] = false;
      });

      stepFields.forEach((step) => {
        step.input.forEach((field) => {
          if (result[field.name] === undefined || result[field.name] === null)
            return;

          if (field.type === "date") {
            result[field.name] = formatDate(result[field.name], "mm-dd") ?? "";
          } else if (
            field.name === "bookingNumeroVueloIda" ||
            field.name === "bookingNumeroVueloRegreso"
          ) {
            result[field.name] = String(result[field.name]);
          } else if (field.type === "number") {
            const num = Number(result[field.name]);
            if (!isNaN(num)) result[field.name] = num;
          }
        });
      });

      break;

    case "edit":
      Object.entries(result).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          const isActive = Object.values(value).some((value) => {
            if (typeof value === "boolean") return value === true;
            if (typeof value === "number") return value > 0;
            if (typeof value === "string")
              return value.trim() !== "" && value !== "false";
            return false;
          });

          result[key] = String(isActive);

          Object.entries(value).forEach(([innerKey, innerValue]) => {
            result[innerKey] = String(innerValue);
          });
        } else if (typeof value === "boolean" || typeof value === "number") {
          result[key] = String(value);
        }
      });

      stepFields.forEach((step) => {
        step.input.forEach((field) => {
          if (field.type === "date" && result[field.name]) {
            result[field.name] =
              formatDate(result[field.name], "yyyy-mm-dd") ?? "";
          }
        });
      });
      break;

    default:
      break;
  }

  return result;
};
