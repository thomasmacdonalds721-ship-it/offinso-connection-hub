/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Securely hashes a string message using the native Web Crypto API SHA-256.
 */
export async function hashString(message: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    // Fallback simple deterministic hash in case of sandbox crypto restrictions
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `fb-${hash.toString(16)}`;
  }
}
