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

// Constants
const SKIP_FUNCTION_NAMES = ["Help"]; // Help is both action and trigger

const RESERVED_PARAM_NAMES: Record<string, string> = {
  GLOBAL: "global",
  STRREF: "strRef",
  class: "classID",
  iD: "id",
};

const TYPE_ALIASES: Record<string, string> = {
  Spell: "SpellID",
  Weather: "WeatherID",
  ShoutIDS: "ShoutID",
};

const TYPE_MAPPING: Record<string, string> = {
  s: "string",
  o: "ObjectPtr",
  i: "number",
  p: "Point",
  a: "Action",
  itmref: "ItmRef",
  splref: "SplRef",
};

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
 * Normalizes a type name to its canonical form.
 */
function normalizeTypeName(typeName: string): string {
  return TYPE_ALIASES[typeName] ?? typeName;
}

/**
 * Normalizes an action parameter name (lowercases entire name).
 */
function normalizeActionParamName(name: string): string {
  // Check for known reserved/special names first
  if (RESERVED_PARAM_NAMES[name]) {
    return RESERVED_PARAM_NAMES[name];
  }

  // Remove whitespace and lowercase entire name
  const sanitized = name.replace(/\s+/g, "");
  const normalized = sanitized.toLowerCase();

  // Check again after normalization for reserved names
  return RESERVED_PARAM_NAMES[normalized] ?? normalized;
}

/**
 * Normalizes a trigger parameter name (lowercases first char only, keeps camelCase).
 */
function normalizeTriggerParamName(name: string): string {
  // Check for known reserved/special names first
  if (RESERVED_PARAM_NAMES[name]) {
    return RESERVED_PARAM_NAMES[name];
  }

  // Remove whitespace and lowercase first character only (for camelCase)
  const sanitized = name.replace(/\s+/g, "");
  const normalized = sanitized.charAt(0).toLowerCase() + sanitized.slice(1);

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
 * Reads a file and returns its content, throwing descriptive errors.
 */
function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
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
    console.warn(`Invalid YAML structure in ${yamlFilePath}. Skipping.`);
    return null;
  }

  const parsedData = parsed as unknown as ParsedActionData;

  if (parsedData.bg2 !== 1) {
    console.log(`${yamlFilePath} is missing BG2 data. Skipping.`);
    return null;
  }

  if (parsedData.unknown || parsedData.no_result) {
    console.log(`Note: ${yamlFilePath} is marked as unknown or has no result. Skipping.`);
    return null;
  }

  const functionName = parsedData.name;
  if (SKIP_FUNCTION_NAMES.includes(functionName)) {
    console.log(`Skipping ${functionName}() function (special case)`);
    return null;
  }

  let description = processCodeBlocks(parsedData.desc || "");
  // Replace block-style comments with single-line comments
  description = description.replace(/\/\* (.*?) \*\//g, "// $1");

  const params: Parameter[] = parsedData.params || [];
  const paramLines: string[] = [];
  let unusedCount = 0;

  for (const param of params) {
    let paramName = param.name.toLowerCase() === "unused" ? `unused${unusedCount++}` : param.name;
    paramName = normalizeActionParamName(paramName);

    // Use || instead of ?? because ids can be empty string
    let paramType = param.ids || TYPE_MAPPING[param.type];
    paramType = normalizeTypeName(paramType);
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

  const header = `import type { Action, ObjectPtr, Point, SpellID, SplRef } from "../index";

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
  const tsOutput: string[] = [header];

  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".yml")) {
      continue;
    }

    const yamlFilePath = path.join(directory, file);
    const declaration = generateTypeScriptDeclaration(yamlFilePath);

    if (declaration) {
      tsOutput.push(declaration);
      console.log(`Processed: ${yamlFilePath}`);
    }
  }

  fs.writeFileSync(outputFile, tsOutput.join("\n\n"), "utf-8");
  console.log(`Output written to ${outputFile}`);
}

/**
 * Parses HTML trigger file and extracts trigger blocks.
 */
function extractTriggerBlocks(fileContent: string): string[] {
  const dom = new JSDOM(fileContent);
  const textContent = dom.window.document.body.textContent || "";

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
  const description = lines.slice(1).join(" ");

  // Expected format: 0xNNNN FunctionName(params)
  const headerMatch = header.match(/^0x[0-9A-Fa-f]+ (\w+)\((.*?)\)$/);
  if (!headerMatch) {
    throw new Error(`Invalid trigger header format: "${header}"`);
  }

  const [, triggerName, params] = headerMatch;
  const paramsStr = parseTriggerParameters(params);

  return `/**\n * ${description.trim()}\n */\ndeclare function ${triggerName}(${paramsStr}): boolean;`;
}

/**
 * Parses trigger parameter string to TypeScript format.
 * Input format: "I:Name*IDS,O:Target,S:String"
 */
function parseTriggerParameters(params: string): string {
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
      const [name, specificType] = nameWithDetails.split("*").map((part) => part.trim());
      const formattedName = normalizeTriggerParamName(name);

      // Use || instead of ?? because specificType can be empty string
      let tsType = specificType || TYPE_MAPPING[type.toLowerCase()];
      if (!tsType) {
        throw new Error(`Unknown type: "${type}" or "${specificType}"`);
      }
      tsType = normalizeTypeName(tsType);

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

  console.log(`Found ${triggerBlocks.length} trigger blocks`);

  const header = `import type { ObjectPtr, SpellID, ItmRef } from "../index";

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

  const tsOutput: string[] = [header];
  let errorCount = 0;

  for (let i = 0; i < triggerBlocks.length; i++) {
    try {
      const declaration = convertTriggerBlockToDeclaration(triggerBlocks[i]);
      tsOutput.push(declaration);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: Failed to process block #${i + 1}: ${message}`);
      console.warn(triggerBlocks[i]);
      errorCount++;
    }
  }

  if (tsOutput.length === 1) {
    throw new Error("No valid trigger blocks were processed");
  }

  fs.writeFileSync(triggerOutputFilePath, tsOutput.join("\n\n"), "utf-8");
  console.log(`Trigger declarations written to ${triggerOutputFilePath} (${errorCount} errors)`);
}

// Main entry point
function main(): void {
  const argv = yargs(hideBin(process.argv))
    .scriptName("ts-update")
    .usage("Usage: $0 <actions_directory> <actions_output_file> <triggers_file> <triggers_output_file>")
    .demandCommand(4)
    .help()
    .parseSync();

  const [actionsDirectory, actionsOutputFile, triggersFile, triggersOutputFile] = argv._ as [
    string,
    string,
    string,
    string,
  ];

  processActionFiles(actionsDirectory, actionsOutputFile);
  processTriggers(triggersFile, triggersOutputFile);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
