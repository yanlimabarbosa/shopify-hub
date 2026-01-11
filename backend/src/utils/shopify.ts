/**
 * Extract and clean shop domain from URL or plain domain string.
 * Handles:
 * - Full URLs: https://shop.myshopify.com/ -> shop.myshopify.com
 * - Domains with trailing slashes: shop.myshopify.com/ -> shop.myshopify.com
 * - Plain domains: shop.myshopify.com -> shop.myshopify.com
 */
export function extractShopDomain(value: string): string {
  try {
    // Remove trailing slashes first
    const cleaned = value.replace(/\/+$/, "");

    if (cleaned.includes("://")) {
      const url = new URL(cleaned);
      return url.hostname;
    }
    // If no protocol, assume it's already a domain and remove trailing slashes
    return cleaned;
  } catch {
    // If URL parsing fails, just return the cleaned value without trailing slashes
    return value.replace(/\/+$/, "");
  }
}
