/**
 * Tests for IESDP URL resolution.
 */

import { describe, it, expect } from "vitest";
import { resolveIesdpUrl, IESDP_BASE_URL } from "./iesdp-url";

describe("resolveIesdpUrl", () => {
  it("returns absolute HTTP URLs unchanged", () => {
    expect(resolveIesdpUrl("http://example.com/page", "eff_v1")).toBe("http://example.com/page");
  });

  it("returns absolute HTTPS URLs unchanged", () => {
    expect(resolveIesdpUrl("https://example.com/page", "eff_v1")).toBe("https://example.com/page");
  });

  it("resolves absolute site paths with leading slash", () => {
    expect(resolveIesdpUrl("/opcodes/bgee.htm#op190", "eff_v1")).toBe(
      `${IESDP_BASE_URL}/opcodes/bgee.htm#op190`,
    );
  });

  it("resolves same-page anchor with known effv1_ prefix", () => {
    expect(resolveIesdpUrl("#effv1_Header_0x2", "eff_v1")).toBe(
      `${IESDP_BASE_URL}/file_formats/ie_formats/eff_v1.htm#effv1_Header_0x2`,
    );
  });

  it("resolves same-page anchor with known itmv1_ prefix", () => {
    expect(resolveIesdpUrl("#itmv1_Header_0x10", "itm_v1")).toBe(
      `${IESDP_BASE_URL}/file_formats/ie_formats/itm_v1.htm#itmv1_Header_0x10`,
    );
  });

  it("resolves same-page anchor with known effv2_ prefix", () => {
    expect(resolveIesdpUrl("#effv2_Body_0x14", "eff_v2")).toBe(
      `${IESDP_BASE_URL}/file_formats/ie_formats/eff_v2.htm#effv2_Body_0x14`,
    );
  });

  it("resolves anchor without known prefix using format's page", () => {
    expect(resolveIesdpUrl("#someAnchor", "eff_v1")).toBe(
      `${IESDP_BASE_URL}/file_formats/ie_formats/eff_v1.htm#someAnchor`,
    );
  });

  it("resolves anchor for opcode context", () => {
    expect(resolveIesdpUrl("#op123", "opcode")).toBe(
      `${IESDP_BASE_URL}/opcodes/bgee.htm#op123`,
    );
  });

  it("returns anchor as-is when format has no known page", () => {
    expect(resolveIesdpUrl("#unknown", "unknown_format")).toBe("#unknown");
  });

  it("resolves relative path for opcode context", () => {
    const result = resolveIesdpUrl("../file_formats/ie_formats/eff_v1.htm", "opcode");
    expect(result).toBe(`${IESDP_BASE_URL}/file_formats/ie_formats/eff_v1.htm`);
  });

  it("resolves relative path for structure context", () => {
    const result = resolveIesdpUrl("eff_v2.htm#effv2_Body_0x14", "eff_v1");
    expect(result).toBe(`${IESDP_BASE_URL}/file_formats/ie_formats/eff_v2.htm#effv2_Body_0x14`);
  });
});
