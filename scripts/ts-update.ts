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
  STRREF: "strRef",
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
  itmref: "ItmRef",
  splref: "SplRef",
};

const ACTION_FILE_HEADER = `import type { Action, ObjectPtr, Point, SpellID, SplRef } from "../index";

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

const TRIGGER_FILE_HEADER = `import type { ObjectPtr, SpellID, ItmRef } from "../index";

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

    // Use explicit empty-string check: ids may be "" which should fall through to TYPE_MAPPING
    const paramType = normalizeTypeName(
      param.ids !== undefined && param.ids !== "" ? param.ids : TYPE_MAPPING[param.type] ?? param.type,
    );
    paramLines.push(`${paramName}: ${paramType}`);
  }

  const paramsStr = paramLines.join(", ");
  return `/**\n * ${description.trim()}\n */\ndeclare function ${functionName}(${paramsStr}): void;`;
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

  return `/**\n * ${description.trim()}\n */\ndeclare function ${triggerName}(${paramsStr}): boolean;`;
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

      // Use specific IDS type if present and non-empty, otherwise fall through to TYPE_MAPPING
      const rawType = specificType !== undefined && specificType !== ""
        ? specificType
        : TYPE_MAPPING[type.toLowerCase()];
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
