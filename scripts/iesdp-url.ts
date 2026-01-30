/**
 * IESDP URL Resolution
 *
 * Resolves relative, anchor-only, and absolute URLs to full IESDP URLs.
 * Used by HTML-to-markdown conversion and structure generation.
 */

export const IESDP_BASE_URL = "https://gibberlings3.github.io/iesdp";

/**
 * Map from anchor ID prefix to IESDP page path.
 * Used to resolve same-page anchors like #effv1_Header_0x2 to full URLs.
 */
export const ANCHOR_PREFIX_TO_PAGE: Readonly<Record<string, string>> = {
  effv1_: "file_formats/ie_formats/eff_v1.htm",
  effv2_: "file_formats/ie_formats/eff_v2.htm",
  itmv1_: "file_formats/ie_formats/itm_v1.htm",
  splv1_: "file_formats/ie_formats/spl_v1.htm",
  storv1_: "file_formats/ie_formats/sto_v1.htm",
};

/**
 * Map from format directory name to IESDP page path.
 */
export const FORMAT_TO_PAGE: Readonly<Record<string, string>> = {
  eff_v1: "file_formats/ie_formats/eff_v1.htm",
  eff_v2: "file_formats/ie_formats/eff_v2.htm",
  itm_v1: "file_formats/ie_formats/itm_v1.htm",
  spl_v1: "file_formats/ie_formats/spl_v1.htm",
  sto_v1: "file_formats/ie_formats/sto_v1.htm",
  fx_v1: "file_formats/ie_formats/itm_v1.htm",
  opcode: "opcodes/bgee.htm",
};

/**
 * Resolves an IESDP URL (relative, anchor-only, or absolute) to a full URL.
 * All IESDP format pages live under file_formats/ie_formats/.
 */
export function resolveIesdpUrl(href: string, formatName: string): string {
  // Already absolute
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  // Absolute site path (from Liquid extraction): /opcodes/bgee.htm#op190
  if (href.startsWith("/")) {
    return `${IESDP_BASE_URL}${href}`;
  }

  // Same-page anchor: #effv1_Header_0x2_3
  if (href.startsWith("#")) {
    const anchor = href.slice(1);
    // Try to match a known prefix to find the correct page
    for (const [prefix, page] of Object.entries(ANCHOR_PREFIX_TO_PAGE)) {
      if (anchor.startsWith(prefix)) {
        return `${IESDP_BASE_URL}/${page}${href}`;
      }
    }
    // No known prefix -- resolve against the current format's page
    const page = FORMAT_TO_PAGE[formatName];
    if (page) {
      return `${IESDP_BASE_URL}/${page}${href}`;
    }
    // Cannot resolve -- return as-is
    return href;
  }

  // Relative path: resolve against the current format's directory
  // Opcode files live at opcodes/, structure files at file_formats/ie_formats/
  const baseDir = formatName === "opcode" ? "opcodes/" : "file_formats/ie_formats/";
  const resolved = new URL(href, `${IESDP_BASE_URL}/${baseDir}placeholder.htm`);
  return resolved.href;
}
