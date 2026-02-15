/**
 * Tests for TypeScript update script utilities.
 */

import { describe, it, expect } from "vitest";
import { normalizeParamName, parseTriggerParameters, extractTriggerBlocks } from "./ts-update";

describe("normalizeParamName", () => {
  describe("lower case strategy (actions)", () => {
    it("lowercases entire name", () => {
      expect(normalizeParamName("TargetName", "lower")).toBe("targetname");
    });

    it("removes whitespace", () => {
      expect(normalizeParamName("Target Name", "lower")).toBe("targetname");
    });

    it("resolves reserved name GLOBAL", () => {
      expect(normalizeParamName("GLOBAL", "lower")).toBe("global");
    });

    it("resolves reserved name class", () => {
      expect(normalizeParamName("class", "lower")).toBe("classID");
    });

    it("resolves reserved name iD", () => {
      expect(normalizeParamName("iD", "lower")).toBe("id");
    });
  });

  describe("camelCase strategy (triggers)", () => {
    it("lowercases first char only", () => {
      expect(normalizeParamName("TargetName", "camelCase")).toBe("targetName");
    });

    it("preserves rest of casing", () => {
      expect(normalizeParamName("AreaType", "camelCase")).toBe("areaType");
    });

    it("removes whitespace", () => {
      expect(normalizeParamName("Target Name", "camelCase")).toBe("targetName");
    });

    it("resolves reserved name GLOBAL", () => {
      expect(normalizeParamName("GLOBAL", "camelCase")).toBe("global");
    });
  });
});

describe("parseTriggerParameters", () => {
  it("returns empty string for empty input", () => {
    expect(parseTriggerParameters("")).toBe("");
  });

  it("parses single parameter with IDS type", () => {
    const result = parseTriggerParameters("I:Style*AStyles");
    expect(result).toBe("style: AStyles");
  });

  it("parses object parameter", () => {
    const result = parseTriggerParameters("O:Target");
    expect(result).toBe("target: ObjectPtr");
  });

  it("parses string parameter", () => {
    const result = parseTriggerParameters("S:Name");
    expect(result).toBe("name: string");
  });

  it("parses multiple parameters", () => {
    const result = parseTriggerParameters("I:Stat*Stats,I:Value,O:Object");
    expect(result).toBe("stat: Stats, value: number, object: ObjectPtr");
  });

  it("applies type aliases (Spell -> SpellID)", () => {
    const result = parseTriggerParameters("I:Spell*Spell");
    expect(result).toBe("spell: SpellID");
  });

  it("throws on invalid parameter format", () => {
    expect(() => parseTriggerParameters("invalid")).toThrow("Invalid parameter format");
  });

  it("throws on unknown type", () => {
    expect(() => parseTriggerParameters("Z:Unknown")).toThrow("Unknown type");
  });

  it("overrides type for param named Scope via PARAM_NAME_TYPES", () => {
    const result = parseTriggerParameters("S:Name*,S:Scope*");
    expect(result).toBe("name: string, scope: Scope");
  });

  it("resolves resref type codes (ItmRef, AreRef, SplRef)", () => {
    expect(parseTriggerParameters("ItmRef:Item*")).toBe("item: ItmRef");
    expect(parseTriggerParameters("AreRef:Area*")).toBe("area: AreRef");
    expect(parseTriggerParameters("SplRef:Spell*")).toBe("spell: SplRef");
  });

  it("does not override non-matching param names", () => {
    const result = parseTriggerParameters("S:MyScope*");
    expect(result).toBe("myScope: string");
  });
});

describe("extractTriggerBlocks", () => {
  it("extracts trigger blocks from HTML content", () => {
    const html = `<html><body>
Header content
0x0001 TriggerOne(I:Value)
Description of trigger one
0x0002 TriggerTwo(O:Object)
Description of trigger two
</body></html>`;
    const blocks = extractTriggerBlocks(html);
    expect(blocks.length).toBe(2);
    expect(blocks[0]).toContain("0x0001");
    expect(blocks[1]).toContain("0x0002");
  });

  it("filters out content before first trigger", () => {
    const html = `<html><body>
Some preamble text
0x0010 OnlyTrigger(S:Name)
Trigger desc
</body></html>`;
    const blocks = extractTriggerBlocks(html);
    expect(blocks.length).toBe(1);
    expect(blocks[0]).toContain("0x0010");
  });

  it("returns empty array for content without triggers", () => {
    const html = "<html><body>No triggers here</body></html>";
    const blocks = extractTriggerBlocks(html);
    expect(blocks.length).toBe(0);
  });
});
