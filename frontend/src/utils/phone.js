// utils/phone.js

/**
 * 77071234567 -> +7 (707) 123-45-67
 */
export function formatPhone(phone) {
  if (!phone) return "";

  const digits = String(phone).replace(/\D/g, "");

  if (digits.length !== 11) {
    return phone;
  }

  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}

/**
 * +7 (707) 123-45-67 -> 77071234567
 */
export function normalizePhone(phone) {
  if (!phone) return "";

  return String(phone).replace(/\D/g, "");
}