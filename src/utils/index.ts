/**
 * Utility functions for Supra token and address handling
 * @module utils
 */

/** Number of decimals in Supra token (8 decimals) */
const SUPRA_DECIMALS = 8;

/**
 * Add padding to an address to make it a 32-byte hex string
 * @param input - The address string (with or without 0x prefix)
 * @returns The padded address with 0x prefix
 * @throws Error if the hex string is longer than 64 characters
 * @example
 * ```typescript
 * const padded = addAddressPadding("0x123");
 * // Returns "0x0000000000000000000000000000000000000000000000000000000000000123"
 * ```
 */
export const addAddressPadding = (input: string): string => {
  const targetHexLen = 64; // 32-byte (64 hex)
  const s = input.trim();
  let hex = s.startsWith("0x") || s.startsWith("0X") ? s.slice(2) : s;
  hex = hex.toLowerCase();

  if (hex.length > targetHexLen) {
    throw new Error("hex string is too long");
  }

  // pad with zeros to target length
  const padded = hex.padStart(targetHexLen, "0");
  return `0x${padded}`;
};

/**
 * Convert human-readable SUPRA amount to smallest unit (quantums)
 * @param amount - Amount in SUPRA tokens
 * @returns Amount in smallest units (quantums)
 * @example
 * ```typescript
 * const quants = toSupraQuant(1.5);
 * // Returns 150000000
 * ```
 */
export const toSupraQuant = (amount: number): number => {
  return amount * 10 ** SUPRA_DECIMALS;
};

/**
 * Convert smallest unit (quantums) to human-readable SUPRA amount
 * @param amount - Amount in smallest units (quantums)
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Human-readable SUPRA amount as a string
 * @example
 * ```typescript
 * const supra = fromSupraQuant(150000000);
 * // Returns "1.50"
 * ```
 */
export const fromSupraQuant = (
  amount: number | bigint,
  decimals = 2
): string => {
  const value = typeof amount === "bigint" ? Number(amount) : amount;
  const factor = 10 ** (SUPRA_DECIMALS - decimals);

  // Truncate without rounding
  const truncated = Math.floor(value / factor);
  return (truncated / 10 ** decimals).toFixed(decimals);
};

/**
 * Remove 0x or 0X prefix from a string
 * @param str - The string to process
 * @returns String without the 0x prefix, if present
 * @example
 * ```typescript
 * const cleaned = remove0xPrefix("0x123abc");
 * // Returns "123abc"
 * ```
 */
export function remove0xPrefix(str: string): string {
  return str.startsWith("0x") ? str.slice(2) : str;
}
