import crypto from "crypto";

export const generatePassword = (length = 12) => {
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes)
    .map((byte) => charset[byte % charset.length])
    .join("");
};
