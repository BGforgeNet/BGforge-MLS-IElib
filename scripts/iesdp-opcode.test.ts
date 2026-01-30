/**
 * Tests for IESDP opcode name normalization.
 */

import { describe, it, expect } from "vitest";
import { normalizeOpcodeName } from "./iesdp-opcode";

describe("normalizeOpcodeName", () => {
  it("lowercases names", () => {
    expect(normalizeOpcodeName("DAMAGE")).toBe("damage");
  });

  it("replaces spaces with underscores", () => {
    expect(normalizeOpcodeName("Cure Sleep")).toBe("cure_sleep");
  });

  it("replaces parentheses with underscores", () => {
    expect(normalizeOpcodeName("Damage (modifier)")).toBe("damage_mod");
  });

  it("removes colons", () => {
    expect(normalizeOpcodeName("State: Panic")).toBe("panic");
  });

  it("replaces hyphens with underscores", () => {
    expect(normalizeOpcodeName("AC-Bonus")).toBe("ac_bonus");
  });

  it("removes commas and ampersands", () => {
    // & and , are removed, then multiple underscores are collapsed
    expect(normalizeOpcodeName("Save & Bonus, Spell")).toBe("save_bonus_spell");
  });

  it("removes periods", () => {
    expect(normalizeOpcodeName("Prof. Bonus")).toBe("prof_bonus");
  });

  it("removes apostrophes", () => {
    expect(normalizeOpcodeName("Assassin's Bonus")).toBe("assassins_bonus");
  });

  it("replaces slashes with underscores", () => {
    expect(normalizeOpcodeName("AC/Attack")).toBe("ac_attack");
  });

  it("applies word replacements: modifier -> mod", () => {
    expect(normalizeOpcodeName("damage modifier")).toBe("damage_mod");
  });

  it("applies word replacements: resistance -> resist", () => {
    expect(normalizeOpcodeName("fire resistance")).toBe("fire_resist");
  });

  it("applies word replacements: removal_remove -> remove", () => {
    expect(normalizeOpcodeName("curse removal_remove")).toBe("curse_remove");
  });

  it("applies word replacements: high_level_ability -> HLA", () => {
    // HLA replacement is uppercase; lowercasing happens before replacements
    expect(normalizeOpcodeName("high_level_ability grant")).toBe("HLA_grant");
  });

  it("collapses multiple underscores", () => {
    expect(normalizeOpcodeName("a  b")).toBe("a_b");
  });

  it("strips leading/trailing underscores", () => {
    expect(normalizeOpcodeName(" test ")).toBe("test");
  });

  it("strips item_ prefix", () => {
    expect(normalizeOpcodeName("Item Colour")).toBe("colour");
  });

  it("strips graphics_ prefix", () => {
    expect(normalizeOpcodeName("Graphics Transparency")).toBe("transparency");
  });

  it("strips spell_effect_ prefix before spell_", () => {
    expect(normalizeOpcodeName("Spell Effect Immunity")).toBe("immunity");
  });

  it("strips spell_ prefix", () => {
    expect(normalizeOpcodeName("Spell Immunity")).toBe("immunity");
  });

  it("strips stat_ prefix", () => {
    expect(normalizeOpcodeName("Stat Strength")).toBe("strength");
  });

  it("strips state_ prefix", () => {
    expect(normalizeOpcodeName("State Panic")).toBe("panic");
  });

  it("strips summon_ prefix", () => {
    expect(normalizeOpcodeName("Summon Creature")).toBe("creature");
  });
});
