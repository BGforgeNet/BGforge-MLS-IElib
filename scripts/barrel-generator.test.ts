/**
 * Tests for the barrel file generator utilities.
 */

import { describe, it, expect } from "vitest";
import { extractExportedNames, toModulePath, moduleSection, Section, formatExportLine } from "./barrel-generator";

describe("extractExportedNames", () => {
  it("extracts type-only exports", () => {
    const content = `import type { IE } from "../index";\n\nexport declare type Align = IE<number, "Align">;`;
    const result = extractExportedNames(content);
    expect(result.types).toEqual(["Align"]);
    expect(result.values).toEqual([]);
  });

  it("extracts value-only exports (declare const)", () => {
    const content = `export declare const ENEMY: EA;\nexport declare const ALLY: EA;`;
    const result = extractExportedNames(content);
    expect(result.types).toEqual([]);
    expect(result.values).toEqual(["ENEMY", "ALLY"]);
  });

  it("extracts mixed type and value exports", () => {
    const content = [
      `export declare type Modal = IE<number, "Modal">;`,
      `export declare const NONE: Modal;`,
      `export declare const BATTLESONG: Modal;`,
    ].join("\n");
    const result = extractExportedNames(content);
    expect(result.types).toEqual(["Modal"]);
    expect(result.values).toEqual(["NONE", "BATTLESONG"]);
  });

  it("extracts declare function exports", () => {
    const content = [
      `export declare function LeaderOf(target?: ObjectPtr): ObjectPtr;`,
      `export declare const Myself: ObjectPtr;`,
    ].join("\n");
    const result = extractExportedNames(content);
    expect(result.types).toEqual([]);
    expect(result.values).toEqual(["LeaderOf", "Myself"]);
  });

  it("deduplicates overloaded function declarations", () => {
    const content = [
      `export declare function Help(): Action;`,
      `export declare function Help(who: ObjectPtr): boolean;`,
    ].join("\n");
    const result = extractExportedNames(content);
    expect(result.values).toEqual(["Help"]);
  });

  it("extracts enum exports", () => {
    const content = `export enum Direction {\n  S = 0,\n  N = 8,\n}`;
    const result = extractExportedNames(content);
    expect(result.types).toEqual([]);
    expect(result.values).toEqual(["Direction"]);
  });

  it("extracts declare enum exports", () => {
    const content = `export declare enum Animate {\n  FIRE_RING = 0x0000,\n  CHUNKS = 0x0100,\n}`;
    const result = extractExportedNames(content);
    expect(result.types).toEqual([]);
    expect(result.values).toEqual(["Animate"]);
  });

  it("extracts const exports (non-declare)", () => {
    const content = `export const NearestEnemyOf = DefaultSelf;`;
    const result = extractExportedNames(content);
    expect(result.types).toEqual([]);
    expect(result.values).toEqual(["NearestEnemyOf"]);
  });

  it("returns empty arrays for content with no exports", () => {
    const content = `import type { IE } from "../index";\nconst x = 1;`;
    const result = extractExportedNames(content);
    expect(result.types).toEqual([]);
    expect(result.values).toEqual([]);
  });

  it("ignores import statements", () => {
    const content = [
      `import type { IE } from "../index";`,
      `import { ObjectPtr } from "..";`,
      `export declare type Foo = IE<number, "Foo">;`,
    ].join("\n");
    const result = extractExportedNames(content);
    expect(result.types).toEqual(["Foo"]);
    expect(result.values).toEqual([]);
  });
});

describe("toModulePath", () => {
  it("strips .ts extension", () => {
    expect(toModulePath("foo.ts")).toBe("./foo");
  });

  it("strips .ts but keeps .d infix", () => {
    expect(toModulePath("foo.d.ts")).toBe("./foo.d");
  });

  it("strips .ts but keeps .ids.d infix", () => {
    expect(toModulePath("align.ids.d.ts")).toBe("./align.ids.d");
  });

  it("handles plain .ids.ts files", () => {
    expect(toModulePath("dir.ids.ts")).toBe("./dir.ids");
  });
});

describe("moduleSection", () => {
  it("classifies actions", () => {
    expect(moduleSection("./actions.d")).toBe(Section.Actions);
  });

  it("classifies triggers", () => {
    expect(moduleSection("./triggers.d")).toBe(Section.Triggers);
  });

  it("classifies help", () => {
    expect(moduleSection("./help.d")).toBe(Section.Help);
  });

  it("classifies IDS modules", () => {
    expect(moduleSection("./align.ids.d")).toBe(Section.IDS);
    expect(moduleSection("./object.d")).toBe(Section.IDS);
    expect(moduleSection("./dir.ids")).toBe(Section.IDS);
  });
});

describe("formatExportLine", () => {
  it("formats single name inline", () => {
    expect(formatExportLine("export", ["A"], "./mod"))
      .toBe("export { A } from './mod';");
  });

  it("formats multiple names one per line", () => {
    const result = formatExportLine("export", ["A", "B", "C"], "./mod");
    expect(result).toBe(
      "export {\n  A,\n  B,\n  C,\n} from './mod';",
    );
  });

  it("formats export type keyword", () => {
    expect(formatExportLine("export type", ["Foo"], "./mod"))
      .toBe("export type { Foo } from './mod';");
  });

  it("formats export type with multiple names one per line", () => {
    const result = formatExportLine("export type", ["Bar", "Foo"], "./mod");
    expect(result).toBe(
      "export type {\n  Bar,\n  Foo,\n} from './mod';",
    );
  });
});
