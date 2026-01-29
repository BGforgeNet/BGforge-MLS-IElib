#!/usr/bin/env tsx

/**
 * IESDP Update Script
 *
 * Generates WeiDU constant definitions from IESDP data:
 * 1. Opcodes from HTML files with YAML frontmatter -> opcode.tph
 * 2. Structure offsets from YAML files -> structures/<type>/iesdp.tph
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import matter from "gray-matter";

// Constants
const SKIP_OPCODE_NAMES = ["empty", "crash", "unknown"];

const OPCODE_NAME_REPLACEMENTS: Record<string, string> = {
  " ": "_",
  ")": "_",
  "(": "_",
  ":": "",
  "-": "_",
  ",": "",
  "&": "",
  ".": "",
  "'": "",
  "/": "_",
  modifier: "mod",
  resistance: "resist",
  removal_remove: "remove",
  high_level_ability: "HLA",
};

const OPCODE_PREFIX_STRIP = [
  "item_",
  "graphics_",
  "spell_effect_", // must be before spell_
  "spell_",
  "stat_",
  "state_",
  "summon_",
];

const TYPE_SIZE_MAP: Record<string, number> = {
  byte: 1,
  char: 1,
  word: 2,
  dword: 4,
  resref: 8,
  strref: 4,
};

// Known types for JSDoc output
const KNOWN_TYPES = new Set([
  "byte",
  "char",
  "word",
  "dword",
  "resref",
  "strref",
  "bytes",
  "char array",
  "byte array",
]);

const STRUCTURE_PREFIX_MAP: Record<string, string> = {
  header: "",
  body: "",
  extended_header: "head",
};

const ID_REPLACEMENTS: Record<string, string> = {
  "probability ": "probability",
  "usability ": "usability",
  "parameter ": "parameter",
  "resource ": "resource",
  alternative: "alt",
  ".": "",
  " ": "_",
};

const ITEM_TYPE_PREFIX = "ITEM_TYPE_";

// Types
interface ItemTypeRaw {
  code: string;
  type: string;
  id?: string;
}

interface OpcodeFrontmatter {
  n: number;
  opname: string;
  bg2: number;
  [key: string]: unknown;
}

interface StructureItem {
  offset?: number;
  desc: string;
  id?: string;
  type: string;
  length?: number;
  mult?: number;
  unused?: boolean;
  unknown?: boolean;
}

// Custom error class for validation errors
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
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
 * Validates that a directory exists.
 */
function validateDirectory(dirPath: string, description: string): void {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`${description} not found: ${dirPath}`);
  }
  if (!fs.statSync(dirPath).isDirectory()) {
    throw new Error(`${description} is not a directory: ${dirPath}`);
  }
}

/**
 * Recursively finds all files with the given extension in a directory.
 */
function findFiles(dirPath: string, ext: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, ext));
    } else if (entry.name.toLowerCase().endsWith(ext.toLowerCase())) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Normalizes an opcode name for use as a WeiDU constant.
 */
function normalizeOpcodeName(name: string): string {
  let result = name.toLowerCase();

  // Apply replacements
  for (const [from, to] of Object.entries(OPCODE_NAME_REPLACEMENTS)) {
    result = result.split(from).join(to);
  }

  // Collapse multiple underscores and strip leading/trailing
  result = result.replace(/_{2,}/g, "_").replace(/^_+|_+$/g, "");

  // Strip known prefixes
  for (const prefix of OPCODE_PREFIX_STRIP) {
    if (result.startsWith(prefix)) {
      result = result.slice(prefix.length);
      break;
    }
  }

  return result;
}

/**
 * Parses an opcode HTML file with YAML frontmatter.
 */
function parseOpcodeFrontmatter(filePath: string): OpcodeFrontmatter | null {
  const content = readFile(filePath);
  const parsed = matter(content);
  const data = parsed.data;

  if (typeof data.n !== "number" || typeof data.opname !== "string") {
    return null;
  }

  return data as OpcodeFrontmatter;
}

/**
 * Generates the opcode.tph file from IESDP opcode definitions.
 */
function generateOpcodeFile(iesdpDir: string, outputFile: string): void {
  const opcodeDir = path.join(iesdpDir, "_opcodes");
  validateDirectory(opcodeDir, "Opcode directory");

  const files = findFiles(opcodeDir, ".html");
  const opcodes: OpcodeFrontmatter[] = [];

  for (const file of files) {
    const opcode = parseOpcodeFrontmatter(file);
    if (opcode && opcode.bg2 === 1) {
      opcodes.push(opcode);
    }
  }

  // Sort by opcode number
  opcodes.sort((a, b) => a.n - b.n);

  // Build unique opcode map (some names collide, need to make unique)
  const opcodesUnique = new Map<string, number>();
  for (const o of opcodes) {
    let name = normalizeOpcodeName(o.opname);

    if (SKIP_OPCODE_NAMES.includes(name)) {
      continue;
    }

    // Check for name collisions
    const existingCount = [...opcodesUnique.keys()].filter((k) => k === name).length;
    if (existingCount > 0) {
      name = `${name}_${existingCount + 1}`;
    }

    // Special case: opcode 175 (hold and hold_graphic share the same name)
    if (o.n === 175) {
      name = "hold_graphic";
    }

    opcodesUnique.set(name, o.n);
  }

  // Generate output
  let output = "";
  for (const [name, num] of opcodesUnique) {
    output += `OUTER_SET OPCODE_${name} = ${num}\n`;
  }

  fs.writeFileSync(outputFile, output);
  console.log(`Generated ${outputFile} with ${opcodesUnique.size} opcodes`);
}

/**
 * Generates the prefix for a structure constant.
 * E.g., "eff_v2" + "body.yml" -> "EFF2_"
 */
function getPrefix(fileVersion: string, dataFileName: string): string {
  const base = fileVersion.replace(/_v.*/, "");
  let version = fileVersion.replace(/.*_v/, "").replace(".", "");
  if (version === "1") {
    version = "";
  }

  const fbase = dataFileName.replace(".yml", "");
  const suffix = STRUCTURE_PREFIX_MAP[fbase] ?? fbase;

  let prefix = `${base}${version}_`;
  if (suffix !== "") {
    prefix = `${prefix}${suffix}_`;
  }

  return prefix.toUpperCase();
}

/**
 * Strips markdown links and HTML tags from text.
 */
function stripMarkup(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Markdown links
    .replace(/<[^>]+>/g, ""); // HTML tags
}

/**
 * Generates a constant ID from a structure item.
 */
function generateId(item: StructureItem, prefix: string): string {
  // Use custom IElib id if provided
  if (item.id) {
    return prefix + item.id;
  }

  // Construct from description
  let iid = stripMarkup(item.desc.toLowerCase());

  for (const [from, to] of Object.entries(ID_REPLACEMENTS)) {
    iid = iid.split(from).join(to);
  }

  iid = prefix + iid;

  // Validate: id must be alnum + '_' only
  if (!/^[a-zA-Z0-9_]+$/.test(iid)) {
    throw new ValidationError(`Invalid id generated: "${iid}" from desc: "${item.desc}"`);
  }

  return iid;
}

/**
 * Computes the size of a structure field.
 */
function getFieldSize(item: StructureItem): number {
  if (item.length !== undefined) {
    return item.length;
  }

  if (!(item.type in TYPE_SIZE_MAP)) {
    throw new ValidationError(`Unknown type: "${item.type}"`);
  }
  const size = TYPE_SIZE_MAP[item.type];

  return item.mult !== undefined ? size * item.mult : size;
}

/**
 * Validates that parsed YAML is an array of structure items.
 */
function isStructureItemArray(data: unknown): data is StructureItem[] {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === "object";
}

interface StructureField {
  offset: number;
  type: string;
}

/**
 * Validates that a type is known.
 */
function validateType(type: string): string {
  if (!KNOWN_TYPES.has(type)) {
    throw new ValidationError(`Unknown type: "${type}"`);
  }
  return type;
}

/**
 * Loads a structure data file and computes offsets.
 */
function loadDatafile(fpath: string, prefix: string): Map<string, StructureField> {
  console.log(`loading ${fpath}`);
  const content = readFile(fpath);
  const parsed = yaml.load(content);

  if (!isStructureItemArray(parsed)) {
    throw new ValidationError(`Invalid structure data in ${fpath}`);
  }

  const data = parsed;
  let curOff = data[0]?.offset ?? 0;
  const items = new Map<string, StructureField>();

  for (const item of data) {
    if (item.offset !== undefined && item.offset !== curOff) {
      console.warn(`Warning: offset mismatch in ${fpath}. Expected ${curOff}, got ${item.offset}`);
    }

    const size = getFieldSize(item);

    // Skip unused/unknown fields
    if (item.unused || item.unknown) {
      curOff += size;
      continue;
    }

    const iid = generateId(item, prefix);
    items.set(iid, {
      offset: curOff,
      type: validateType(item.type),
    });
    curOff += size;
  }

  return items;
}

/**
 * Gets the output directory name for a format.
 * E.g., "eff_v1" -> "eff", "eff_v2" -> "eff2"
 */
function getOutputDirName(formatName: string): string {
  const base = formatName.replace(/_v.*/, "");
  const version = formatName.replace(/.*_v/, "");
  // For version 1, use just the base name; for v2+, append version number
  return version === "1" ? base : `${base}${version}`;
}

/**
 * Writes structure items to the appropriate output file.
 */
function writeStructureFile(formatName: string, items: Map<string, StructureField>, structuresDir: string): void {
  const dirName = getOutputDirName(formatName);
  const outputDir = path.join(structuresDir, dirName);
  const outputFile = path.join(outputDir, "iesdp.tph");

  fs.mkdirSync(outputDir, { recursive: true });

  let text = "";
  for (const [id, field] of items) {
    text += `/** @type ${field.type} */\n`;
    text += `OUTER_SET ${id} = 0x${field.offset.toString(16)}\n`;
  }

  fs.writeFileSync(outputFile, text);
  console.log(`Generated ${outputFile}`);
}

/**
 * Processes all structure definitions from IESDP.
 */
function processStructures(iesdpDir: string, structuresDir: string): void {
  const fileFormatsDir = path.join(iesdpDir, "_data", "file_formats");
  validateDirectory(fileFormatsDir, "File formats directory");

  const formats = fs.readdirSync(fileFormatsDir);

  // Sort formats so higher versions come first, then v1 overwrites
  formats.sort((a, b) => b.localeCompare(a));

  for (const ff of formats) {
    const ffDir = path.join(fileFormatsDir, ff);
    if (!fs.statSync(ffDir).isDirectory()) {
      continue;
    }

    const items = new Map<string, StructureField>();
    const files = fs.readdirSync(ffDir).sort();

    for (const f of files) {
      // Feature blocks handled separately
      if (f === "feature_block.yml") {
        continue;
      }

      const prefix = getPrefix(ff, f);
      const fpath = path.join(ffDir, f);
      const newItems = loadDatafile(fpath, prefix);

      for (const [k, v] of newItems) {
        items.set(k, v);
      }
    }

    writeStructureFile(ff, items, structuresDir);
  }

  // Feature block (output to fx/ directory)
  const featureBlockPath = path.join(fileFormatsDir, "itm_v1", "feature_block.yml");
  if (fs.existsSync(featureBlockPath)) {
    const fxItems = loadDatafile(featureBlockPath, "FX_");
    writeStructureFile("fx_v1", fxItems, structuresDir);
  }

  // Item types
  const itemTypesPath = path.join(fileFormatsDir, "item_types.yml");
  if (fs.existsSync(itemTypesPath)) {
    generateItemTypesFile(itemTypesPath, structuresDir);
  }
}

/**
 * Validates that parsed YAML is an array of item type entries.
 */
function isItemTypeArray(data: unknown): data is ItemTypeRaw[] {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === "object";
}

/**
 * Generates an ID for an item type entry.
 * Uses custom 'id' field if present, otherwise derives from description.
 */
function getItemTypeId(item: ItemTypeRaw): string {
  if (item.id !== undefined) {
    return ITEM_TYPE_PREFIX + item.id;
  }

  let id = stripMarkup(item.type.toLowerCase());
  for (const [from, to] of Object.entries(ID_REPLACEMENTS)) {
    id = id.split(from).join(to);
  }
  id = ITEM_TYPE_PREFIX + id;

  if (!/^[a-zA-Z0-9_]+$/.test(id)) {
    throw new ValidationError(`Invalid item type id generated: "${id}" from type: "${item.type}"`);
  }

  return id;
}

/**
 * Generates structures/item_types.tph from IESDP item_types.yml.
 */
function generateItemTypesFile(itemTypesPath: string, structuresDir: string): void {
  console.log(`loading ${itemTypesPath}`);
  const content = readFile(itemTypesPath);
  const parsed = yaml.load(content);

  if (!isItemTypeArray(parsed)) {
    throw new ValidationError(`Invalid item types data in ${itemTypesPath}`);
  }

  let text = "";
  for (const item of parsed) {
    if (item.type.toLowerCase() === "unknown") {
      continue;
    }

    const code = parseInt(item.code, 16);
    if (Number.isNaN(code)) {
      throw new ValidationError(`Invalid item type code '${item.code}' for '${item.type}' in ${itemTypesPath}`);
    }

    const id = getItemTypeId(item);
    text += `OUTER_SET ${id} = 0x${code.toString(16).padStart(2, "0")}\n`;
  }

  const outputFile = path.join(structuresDir, "item_types.tph");
  fs.writeFileSync(outputFile, text);
  console.log(`Generated ${outputFile}`);
}

// Main entry point
function main(): void {
  const argv = yargs(hideBin(process.argv))
    .scriptName("iesdp-update")
    .usage("Usage: $0 -s <iesdp_dir> --opcode_file <opcode_file> [--structures_dir <dir>]")
    .option("s", {
      alias: "iesdp_dir",
      describe: "IESDP directory",
      type: "string",
      demandOption: true,
    })
    .option("opcode_file", {
      describe: "Opcode definition file (WeiDU tpp)",
      type: "string",
      demandOption: true,
    })
    .option("structures_dir", {
      describe: "Output directory for structure definitions",
      type: "string",
      default: "structures",
    })
    .help()
    .parseSync();

  const iesdpDir = argv.s;
  const opcodeFile = argv.opcode_file;
  const structuresDir = argv.structures_dir;

  validateDirectory(iesdpDir, "IESDP directory");

  generateOpcodeFile(iesdpDir, opcodeFile);
  processStructures(iesdpDir, structuresDir);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
