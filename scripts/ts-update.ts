#!/usr/bin/env tsx

/**
 * TypeScript Update Script
 *
 * Generates TypeScript declarations for BG2 scripting actions and triggers
 * from IESDP YAML and HTML data.
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { JSDOM } from "jsdom";
import { readFile, log } from "./utils.js";

// Constants
const SKIP_FUNCTION_NAMES = ["Help"]; // Help is both action and trigger

const RESERVED_PARAM_NAMES: Readonly<Record<string, string>> = {
  GLOBAL: "global",
  class: "classID",
  iD: "id",
};

const TYPE_ALIASES: Readonly<Record<string, string>> = {
  Spell: "SpellID",
  Weather: "WeatherID",
  ShoutIDS: "ShoutID",
};

const TYPE_MAPPING: Readonly<Record<string, string>> = {
  s: "string",
  o: "ObjectPtr",
  i: "number",
  p: "Point",
  a: "Action",
  areref: "AreRef",
  creref: "CreRef",
  itmref: "ItmRef",
  splref: "SplRef",
  strref: "StrRef",
};

/** Maps YAML param names to TypeScript types. Checked before type/ids resolution. */
const PARAM_NAME_TYPES: Readonly<Record<string, string>> = {
  Scope: "Scope",
  Face: "Direction",
  Direction: "Direction",
};

const ACTION_FILE_HEADER = `import type { Action, AreRef, CreRef, ItmRef, ObjectPtr, Point, Scope, SpellID, SplRef, StrRef } from "../index";

import type { Direction } from "./dir.ids";
import type { Align } from "./align.ids";
import type { Animate } from "./animate.ids";
import type { AreaFlag } from "./areaflag.ids";
import type { AreaTypeID as AreaType } from "./areatype.ids";
import type { ClassID as Class } from "./class.ids";
import type { DMGtype } from "./dmgtype.ids";
import type { EA } from "./ea.ids";
import type { GenderID as Gender } from "./gender.ids";
import type { GeneralID as General } from "./general.ids";
import type { GTimes } from "./gtimes.ids";
import type { MFlags } from "./mflags.ids";
import type { JourType } from "./jourtype.ids";
import type { KitID as Kit } from "./kit.ids";
import type { RaceID as Race } from "./race.ids";
import type { ScrLev } from "./scrlev.ids";
import type { Scroll } from "./scroll.ids";
import type { Seq } from "./seq.ids";
import type { ShoutID } from "./shoutids.ids";
import type { Slots } from "./slots.ids";
import type { SndSlot } from "./sndslot.ids";
import type { SoundOff } from "./soundoff.ids";
import type { Specific } from "./specific.ids";
import type { TimeID as Time } from "./time.ids";
import type { WeatherID } from "./weather.ids";

`;

const TRIGGER_FILE_HEADER = `import type { AreRef, ItmRef, ObjectPtr, Scope, SplRef, SpellID } from "../index";

import type { Align } from "./align.ids";
import type { AreaTypeID as AreaType } from "./areatype.ids";
import type { AStyles } from "./astyles.ids";
import type { ClassID as Class } from "./class.ids";
import type { Damages } from "./damages.ids";
import type { DiffLev } from "./difflev.ids";
import type { EA } from "./ea.ids";
import type { GenderID as Gender } from "./gender.ids";
import type { GeneralID as General } from "./general.ids";
import type { Happy } from "./happy.ids";
import type { HotKeyID as HotKey } from "./hotkey.ids";
import type { KitID as Kit } from "./kit.ids";
import type { NPC } from "./npc.ids";
import type { Modal } from "./modal.ids";
import type { RaceID as Race } from "./race.ids";
import type { ReactionID as Reaction } from "./reaction.ids";
import type { ShoutID } from "./shoutids.ids";
import type { Slots } from "./slots.ids";
import type { Specific } from "./specific.ids";
import type { State } from "./state.ids";
import type { Stats } from "./stats.ids";
import type { TimeID as Time } from "./time.ids";
import type { TimeODay } from "./timeoday.ids";

`;

// Types
interface ModuleExports {
  types: string[];
  values: string[];
}

interface Parameter {
  name: string;
  type: string;
  ids?: string;
}

interface ParsedActionData {
  bg2: number;
  unknown?: boolean;
  no_result?: boolean;
  name: string;
  desc?: string;
  params?: Parameter[];
}

/**
 * Validates that parsed YAML matches the expected ParsedActionData shape.
 */
function isValidActionData(data: unknown): data is ParsedActionData {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  return "bg2" in data && typeof data.bg2 === "number"
    && "name" in data && typeof data.name === "string";
}

/**
 * Normalizes a type name to its canonical form.
 */
function normalizeTypeName(typeName: string): string {
  return TYPE_ALIASES[typeName] ?? typeName;
}

/**
 * Normalizes a parameter name with a given case strategy.
 * - 'lower': lowercases entire name (used for action params)
 * - 'camelCase': lowercases first char only, keeps rest (used for trigger params)
 */
export function normalizeParamName(name: string, caseStrategy: "lower" | "camelCase"): string {
  // Check for known reserved/special names first
  const reserved = RESERVED_PARAM_NAMES[name];
  if (reserved) {
    return reserved;
  }

  // Remove whitespace and apply case strategy
  const sanitized = name.replace(/\s+/g, "");
  const normalized = caseStrategy === "lower"
    ? sanitized.toLowerCase()
    : sanitized.charAt(0).toLowerCase() + sanitized.slice(1);

  // Check again after normalization for reserved names
  return RESERVED_PARAM_NAMES[normalized] ?? normalized;
}

/**
 * Validates that a value is a non-null object.
 */
function isValidObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Prettifies code blocks in descriptions.
 */
function processCodeBlocks(description: string): string {
  return description.replace(/```(.*?)```/gs, (_match, code: string) => {
    const indentedCode = code
      .trim()
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n");
    return `\`\`\`weidu-baf\n${indentedCode}\n\`\`\``;
  });
}

/**
 * Reads and parses a YAML action file, converting it to a TS declaration.
 */
function generateTypeScriptDeclaration(yamlFilePath: string): string | null {
  const fileContent = readFile(yamlFilePath);
  const parsed = yaml.load(fileContent);

  if (!isValidObject(parsed)) {
    log(`Warning: ${yamlFilePath}: invalid YAML structure (expected object, got ${typeof parsed})`);
    return null;
  }

  if (!isValidActionData(parsed)) {
    const obj = parsed;
    // Files for other game variants (bg1, bgee, pst, iwd) lack bg2 field -- expected, skip silently
    if (!("bg2" in obj)) {
      return null;
    }
    const missing = [
      typeof obj.bg2 !== "number" ? "bg2 (number)" : "",
      typeof obj.name !== "string" ? "name (string)" : "",
    ].filter(Boolean);
    log(`Warning: ${yamlFilePath}: missing required fields: ${missing.join(", ")}`);
    return null;
  }

  // bg2 field exists but is not 1 (e.g. 0 = not applicable to BG2)
  if (parsed.bg2 !== 1) {
    return null;
  }

  // unknown/no_result actions have no usable signature
  if (parsed.unknown || parsed.no_result) {
    return null;
  }

  const functionName = parsed.name;
  if (SKIP_FUNCTION_NAMES.includes(functionName)) {
    log(`Skipping ${yamlFilePath}: ${functionName}() is in skip list`);
    return null;
  }

  let description = processCodeBlocks(parsed.desc ?? "");
  // Replace block-style comments with single-line comments
  description = description.replace(/\/\* (.*?) \*\//g, "// $1");

  const params: Parameter[] = parsed.params ?? [];
  const paramLines: string[] = [];
  let unusedCount = 0;

  for (const param of params) {
    let paramName = param.name.toLowerCase() === "unused" ? `unused${unusedCount++}` : param.name;
    paramName = normalizeParamName(paramName, "lower");

    // Priority: param name exact override > ids field > type code
    const typeOverride = PARAM_NAME_TYPES[param.name];
    // Use explicit empty-string check: ids may be "" which should fall through to TYPE_MAPPING
    const paramType = typeOverride ?? normalizeTypeName(
      param.ids !== undefined && param.ids !== "" ? param.ids : TYPE_MAPPING[param.type] ?? param.type,
    );
    paramLines.push(`${paramName}: ${paramType}`);
  }

  const paramsStr = paramLines.join(", ");
  return `/**\n * ${description.trim()}\n */\nexport declare function ${functionName}(${paramsStr}): Action;`;
}

/**
 * Processes a directory of YAML action files and generates TypeScript declarations.
 */
function processActionFiles(directory: string, outputFile: string): void {
  if (!fs.existsSync(directory)) {
    throw new Error(`Actions directory not found: ${directory}`);
  }

  const tsOutput: string[] = [ACTION_FILE_HEADER];
  let processedCount = 0;
  let skippedCount = 0;

  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".yml")) {
      continue;
    }

    const yamlFilePath = path.join(directory, file);
    const declaration = generateTypeScriptDeclaration(yamlFilePath);

    if (declaration) {
      tsOutput.push(declaration);
      processedCount++;
    } else {
      skippedCount++;
    }
  }

  fs.writeFileSync(outputFile, tsOutput.join("\n\n"), "utf-8");
  log(`Actions: ${processedCount} processed, ${skippedCount} skipped. Output: ${outputFile}`);
}

/**
 * Parses HTML trigger file and extracts trigger blocks.
 */
export function extractTriggerBlocks(fileContent: string): string[] {
  const dom = new JSDOM(fileContent);
  const textContent = dom.window.document.body.textContent;

  // Split text content into blocks based on lines starting with '0x'
  // Filter out any content before the first trigger (frontmatter, headers, etc.)
  return textContent
    .split(/\s+(?=0x[0-9A-Fa-f]{4})/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("0x"));
}

/**
 * Extracts exported type and value names from a TypeScript source file.
 * Deduplicates function overloads (same name exported multiple times).
 */
export function extractExportedNames(fileContent: string): ModuleExports {
  const types = new Set<string>();
  const values = new Set<string>();

  for (const line of fileContent.split("\n")) {
    let match;
    if ((match = line.match(/^export declare type (\w+)/))) {
      const name = match[1];
      if (name) types.add(name);
    } else if ((match = line.match(/^export declare (?:const|function) (\w+)/))) {
      const name = match[1];
      if (name) values.add(name);
    } else if ((match = line.match(/^export (?:enum|const) (\w+)/))) {
      const name = match[1];
      if (name) values.add(name);
    }
  }

  return { types: [...types], values: [...values] };
}

/**
 * Converts a trigger block to a TypeScript declaration.
 * Block format: "0xNNNN TriggerName(params)\nDescription..."
 */
function convertTriggerBlockToDeclaration(block: string): string {
  const lines = block.split("\n").map((line) => line.trim());
  const header = lines[0];
  if (!header) {
    throw new Error(`Empty trigger block`);
  }
  const description = lines.slice(1).join(" ");

  // Expected format: 0xNNNN FunctionName(params)
  const headerMatch = header.match(/^0x[0-9A-Fa-f]+ (\w+)\((.*?)\)$/);
  if (!headerMatch) {
    throw new Error(`Invalid trigger header format: "${header}"`);
  }

  const triggerName = headerMatch[1];
  const params = headerMatch[2];
  if (!triggerName || params === undefined) {
    throw new Error(`Failed to parse trigger name/params from: "${header}"`);
  }
  const paramsStr = parseTriggerParameters(params);

  return `/**\n * ${description.trim()}\n */\nexport declare function ${triggerName}(${paramsStr}): boolean;`;
}

/**
 * Parses trigger parameter string to TypeScript format.
 * Input format: "I:Name*IDS,O:Target,S:String"
 */
export function parseTriggerParameters(params: string): string {
  if (params === "") {
    return params;
  }

  return params
    .split(",")
    .map((param) => {
      const [type, nameWithDetails] = param.split(":").map((part) => part.trim());
      if (!type || !nameWithDetails) {
        throw new Error(`Invalid parameter format: "${param}"`);
      }

      // Extract name and specific type (e.g., "Style*AStyles" -> name="Style", specificType="AStyles")
      const parts = nameWithDetails.split("*").map((part) => part.trim());
      const name = parts[0];
      if (!name) {
        throw new Error(`Empty parameter name in: "${param}"`);
      }
      const specificType = parts.length > 1 ? parts[1] : undefined;
      const formattedName = normalizeParamName(name, "camelCase");

      // Priority: param name exact override > specific IDS type > base type code
      const typeOverride = PARAM_NAME_TYPES[name];
      const rawType = typeOverride ?? (specificType !== undefined && specificType !== ""
        ? specificType
        : TYPE_MAPPING[type.toLowerCase()]);
      if (!rawType) {
        throw new Error(`Unknown type: "${type}" or "${specificType}"`);
      }
      const tsType = normalizeTypeName(rawType);

      return `${formattedName}: ${tsType}`;
    })
    .join(", ");
}

/**
 * Processes trigger HTML file and generates TypeScript declarations.
 */
function processTriggers(triggerFilePath: string, triggerOutputFilePath: string): void {
  if (!fs.existsSync(triggerFilePath)) {
    throw new Error(`Triggers file not found: ${triggerFilePath}`);
  }

  const fileContent = readFile(triggerFilePath);
  const triggerBlocks = extractTriggerBlocks(fileContent);

  log(`Found ${triggerBlocks.length} trigger blocks`);

  const tsOutput: string[] = [TRIGGER_FILE_HEADER];
  let errorCount = 0;

  for (const [i, block] of triggerBlocks.entries()) {
    // Skip triggers that are handled separately (e.g. Help is both action and trigger)
    const nameMatch = block.match(/^0x[0-9A-Fa-f]+ (\w+)\(/);
    if (nameMatch?.[1] && SKIP_FUNCTION_NAMES.includes(nameMatch[1])) {
      log(`Skipping trigger block #${i + 1}: ${nameMatch[1]}() is in skip list`);
      continue;
    }

    try {
      const declaration = convertTriggerBlockToDeclaration(block);
      tsOutput.push(declaration);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log(`Warning: Failed to process block #${i + 1}: ${message}`);
      log(block);
      errorCount++;
    }
  }

  if (tsOutput.length === 1) {
    throw new Error("No valid trigger blocks were processed");
  }

  fs.writeFileSync(triggerOutputFilePath, tsOutput.join("\n\n"), "utf-8");
  log(`Trigger declarations written to ${triggerOutputFilePath} (${errorCount} errors)`);
}

/**
 * Computes the import path for a source file relative to the barrel.
 * Strips the `.ts` suffix; keeps `.d` and `.ids.d` infixes intact.
 * - `foo.ids.d.ts` -> `./foo.ids.d`
 * - `foo.d.ts` -> `./foo.d`
 * - `foo.ts` -> `./foo`
 */
function toModulePath(filename: string): string {
  return `./${filename.replace(/\.ts$/, "")}`;
}

/**
 * Barrel section indices. Modules are grouped into sections, then sorted
 * alphabetically within each section.
 */
const enum Section {
  Actions = 0,
  IDS = 1,
  Triggers = 2,
  Help = 3,
}

/**
 * Returns the barrel section for a given module path.
 */
function moduleSection(modulePath: string): Section {
  if (modulePath === "./actions.d") return Section.Actions;
  if (modulePath === "./triggers.d") return Section.Triggers;
  if (modulePath === "./help.d") return Section.Help;
  return Section.IDS;
}

const OBJECT_MODULES = new Set(["./object.d", "./object"]);

/**
 * Formats a single export line. Uses multi-line layout when there are more
 * than 3 names, single-line otherwise. Wraps long lines at ~80 cols.
 */
function formatExportLine(keyword: "export" | "export type", names: readonly string[], modulePath: string): string {
  if (names.length <= 3) {
    return `${keyword} { ${names.join(", ")} } from '${modulePath}';`;
  }

  // Multi-line: wrap names at ~80 columns for readability
  const lines: string[] = [`${keyword} {`];
  let currentLine = "  ";
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (!name) continue;
    const separator = i < names.length - 1 ? ", " : ",";
    const candidate = currentLine + name + separator;
    // +2 for closing `} from '...';` line -- we just cap content lines at ~80
    if (candidate.length > 80 && currentLine !== "  ") {
      lines.push(currentLine.trimEnd());
      currentLine = `  ${name}${separator}`;
    } else {
      currentLine = candidate;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trimEnd());
  }
  lines.push(`} from '${modulePath}';`);
  return lines.join("\n");
}

/**
 * Generates the bg2/index.ts barrel file by scanning all sibling modules
 * and extracting their exported names.
 */
function generateBarrelFile(bg2Dir: string): void {
  const allFiles = fs.readdirSync(bg2Dir)
    .filter((f) => f !== "index.ts" && f.endsWith(".ts"));

  // Build module path -> sorted exports map
  const moduleMap = new Map<string, ModuleExports>();
  for (const file of allFiles) {
    const content = fs.readFileSync(path.join(bg2Dir, file), "utf-8");
    const exports = extractExportedNames(content);
    if (exports.types.length === 0 && exports.values.length === 0) {
      continue;
    }
    // Sort names alphabetically within each category
    const sorted: ModuleExports = {
      types: [...exports.types].sort(),
      values: [...exports.values].sort(),
    };
    moduleMap.set(toModulePath(file), sorted);
  }

  // Sort modules by section, then alphabetically within section
  const sortedModules = [...moduleMap.keys()].sort((a, b) => {
    const sd = moduleSection(a) - moduleSection(b);
    return sd !== 0 ? sd : a.localeCompare(b);
  });

  const out: string[] = [
    "/**",
    " * BG2 barrel re-exports.",
    " *",
    " * Generated by ts-update. Do not edit manually.",
    " *",
    " * Uses named re-exports (not export *) so esbuild can statically resolve each",
    " * binding without falling back to runtime __reExport helpers for externalized",
    " * .d.ts modules.",
    " */",
    "",
  ];

  let currentSection: Section | -1 = -1;
  let inObjectGroup = false;

  for (const modulePath of sortedModules) {
    const section = moduleSection(modulePath);
    const exports = moduleMap.get(modulePath);
    if (!exports) continue;
    const isObject = OBJECT_MODULES.has(modulePath);

    // Section transition
    if (section !== currentSection) {
      if (currentSection !== -1) out.push("");

      if (section === Section.Actions) {
        out.push("// --- Actions (generated from IESDP) ---");
      } else if (section === Section.IDS) {
        out.push("// --- IDS types and constants ---");
      } else if (section === Section.Triggers) {
        out.push("// --- Triggers (generated from IESDP) ---");
      } else {
        out.push("// Help() is both an action and a trigger -- lives in a separate file.");
      }
      currentSection = section;
      inObjectGroup = false;
    }

    // Sub-section comments within IDS
    if (section === Section.IDS) {
      if (isObject && !inObjectGroup) {
        out.push("");
        out.push("// --- Object identifiers ---");
        inObjectGroup = true;
      } else if (!isObject && inObjectGroup) {
        out.push("");
        out.push("// --- More IDS types and constants ---");
        inObjectGroup = false;
      }
    }

    // Emit type exports
    if (exports.types.length > 0) {
      out.push(formatExportLine("export type", exports.types, modulePath));
    }
    // Emit value exports
    if (exports.values.length > 0) {
      out.push(formatExportLine("export", exports.values, modulePath));
    }
  }

  out.push("");
  const outputPath = path.join(bg2Dir, "index.ts");
  fs.writeFileSync(outputPath, out.join("\n"), "utf-8");
  log(`Barrel file written to ${outputPath} (${moduleMap.size} modules)`);
}

// Main entry point
function main(): void {
  const argv = yargs(hideBin(process.argv))
    .scriptName("ts-update")
    .usage("Usage: $0 <actions_directory> <actions_output_file> <triggers_file> <triggers_output_file>")
    .demandCommand(4)
    .help()
    .parseSync();

  const args = argv._.map(String);
  const actionsDirectory = args[0];
  const actionsOutputFile = args[1];
  const triggersFile = args[2];
  const triggersOutputFile = args[3];

  if (!actionsDirectory || !actionsOutputFile || !triggersFile || !triggersOutputFile) {
    throw new Error("Expected 4 positional arguments");
  }

  processActionFiles(actionsDirectory, actionsOutputFile);
  processTriggers(triggersFile, triggersOutputFile);

  // Generate barrel file from the same directory as the actions output
  const bg2Dir = path.dirname(actionsOutputFile);
  generateBarrelFile(bg2Dir);
}

// Only run CLI when executed directly (not imported as a module for testing)
const isDirectExecution = process.argv[1]?.endsWith("ts-update.ts") ?? false;
if (isDirectExecution) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}
