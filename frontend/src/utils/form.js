// utils/getChangedFields.js
import { normalizePhone } from "./phone";


export function getChangedFields(formData, user) {
  return Object.fromEntries(
    Object.entries(formData)
      .filter(([key, value]) => {
        const normalizedValue =
          key === "phone_number"
            ? normalizePhone(value)
            : value;

        const originalValue =
          key === "phone_number"
            ? user.phone ?? ""
            : user[key] ?? "";

        return normalizedValue !== originalValue;
      })
      .map(([key, value]) => [
        key,
        key === "phone_number"
          ? normalizePhone(value)
          : value
      ])
  );
}