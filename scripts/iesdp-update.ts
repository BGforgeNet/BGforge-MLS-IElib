#!/usr/bin/env tsx

/**
 * IESDP Update Script
 *
 * Generates WeiDU constant definitions from IESDP data:
 * 1. Opcodes from HTML files with YAML frontmatter -> opcode.tph
 * 2. Structure offsets from YAML files -> structures/<type>/iesdp.tph
 * 3. Item types from YAML -> structures/item_types.tph
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import matter from "gray-matter";
import { JSDOM } from "jsdom";
import { readFile, validateDirectory, log } from "./utils.js";

// Constants
const IESDP_BASE_URL = "https://gibberlings3.github.io/iesdp";
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

interface StructureField {
  offset: number;
  type: string;
  desc: string;
}

// Custom error class for validation errors
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
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
    result = result.replaceAll(from, to);
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

    // Check for name collisions -- O(1) Map lookup
    if (opcodesUnique.has(name)) {
      name = `${name}_2`;
    }

    // Special case: opcode 175 (hold and hold_graphic share the same name)
    if (o.n === 175) {
      name = "hold_graphic";
    }

    opcodesUnique.set(name, o.n);
  }

  // Generate output
  const lines = [...opcodesUnique.entries()].map(
    ([name, num]) => `OUTER_SET OPCODE_${name} = ${num}`,
  );

  fs.writeFileSync(outputFile, lines.join("\n") + "\n");
  log(`Generated ${outputFile} with ${opcodesUnique.size} opcodes`);
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
 * Map from anchor ID prefix to IESDP page path.
 * Used to resolve same-page anchors like #effv1_Header_0x2 to full URLs.
 */
const ANCHOR_PREFIX_TO_PAGE: Record<string, string> = {
  effv1_: "file_formats/ie_formats/eff_v1.htm",
  effv2_: "file_formats/ie_formats/eff_v2.htm",
  itmv1_: "file_formats/ie_formats/itm_v1.htm",
  splv1_: "file_formats/ie_formats/spl_v1.htm",
  storv1_: "file_formats/ie_formats/sto_v1.htm",
};

/**
 * Map from format directory name to IESDP page path.
 */
const FORMAT_TO_PAGE: Record<string, string> = {
  eff_v1: "file_formats/ie_formats/eff_v1.htm",
  eff_v2: "file_formats/ie_formats/eff_v2.htm",
  itm_v1: "file_formats/ie_formats/itm_v1.htm",
  spl_v1: "file_formats/ie_formats/spl_v1.htm",
  sto_v1: "file_formats/ie_formats/sto_v1.htm",
  fx_v1: "file_formats/ie_formats/itm_v1.htm",
};

/**
 * Resolves an IESDP URL (relative, anchor-only, or absolute) to a full URL.
 * All IESDP format pages live under file_formats/ie_formats/.
 */
function resolveIesdpUrl(href: string, formatName: string): string {
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
    // No known prefix — resolve against the current format's page
    const page = FORMAT_TO_PAGE[formatName];
    if (page) {
      return `${IESDP_BASE_URL}/${page}${href}`;
    }
    // Cannot resolve — return as-is
    return href;
  }

  // Relative path: resolve against file_formats/ie_formats/
  // ../ie_formats/X → file_formats/ie_formats/X
  // ../../opcodes/X → opcodes/X
  const baseDir = "file_formats/ie_formats/";
  const resolved = new URL(href, `${IESDP_BASE_URL}/${baseDir}placeholder.htm`);
  return resolved.href;
}

/**
 * Recursively walks a DOM node tree, converting HTML elements to markdown.
 * listDepth tracks nesting level for list indentation.
 */
function walkNode(node: Node, formatName: string, listDepth: number = 0): string {
  // Text node: return content as-is (whitespace handled per-element)
  if (node.nodeType === 3) {
    return node.textContent ?? "";
  }
  // Skip non-element nodes (comments, etc.)
  if (node.nodeType !== 1) {
    return "";
  }

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  switch (tag) {
    case "a": {
      const children = walkChildren(el, formatName, listDepth);
      const href = el.getAttribute("href");
      // Named anchors or empty href (e.g. after Liquid stripping) pass through children
      if (!href) {
        return children;
      }
      return `[${children}](${resolveIesdpUrl(href, formatName)})`;
    }
    case "code":
      return `\`${walkChildren(el, formatName, listDepth)}\``;
    case "b":
    case "strong":
      return `**${walkChildren(el, formatName, listDepth)}**`;
    case "br":
      return "\n";
    case "ul":
    case "ol":
      return walkChildren(el, formatName, listDepth + 1);
    case "li": {
      const indent = "  ".repeat(Math.max(0, listDepth - 1));
      const content = walkChildrenCollapsed(el, formatName, listDepth).trim();
      return `\n${indent}- ${content}`;
    }
    case "div": {
      const content = walkChildrenCollapsed(el, formatName, listDepth).trim();
      return `\n${content}`;
    }
    // Pass through content for unsupported tags (small, sup, sub, etc.)
    default:
      return walkChildren(el, formatName, listDepth);
  }
}

/**
 * Walks all child nodes, concatenating their markdown output.
 */
function walkChildren(node: Node, formatName: string, listDepth: number): string {
  return Array.from(node.childNodes)
    .map((child) => walkNode(child, formatName, listDepth))
    .join("");
}

/**
 * Walks child nodes, collapsing whitespace in text nodes.
 * Used for block-level elements (li, div) where HTML indentation is not meaningful.
 */
function walkChildrenCollapsed(node: Node, formatName: string, listDepth: number): string {
  return Array.from(node.childNodes)
    .map((child) => {
      if (child.nodeType === 3) {
        return (child.textContent ?? "").replace(/\s+/g, " ");
      }
      return walkNode(child, formatName, listDepth);
    })
    .join("");
}

/**
 * Converts HTML to markdown using DOM parsing. Handles nested tags correctly.
 * Resolves all URLs to absolute IESDP links.
 * Also strips Jekyll liquid tags (both {{ }} and {% %}).
 */
function htmlToMarkdown(text: string, formatName: string): string {
  const cleaned = text
    // Jekyll liquid expressions: extract quoted path from {{ "path" | prepend: relurl }}
    .replace(/\{\{\s*"([^"]+)"\s*\|\s*prepend:\s*relurl\s*\}\}/g, "$1")
    // Strip remaining liquid tags ({{ }} and {% %})
    .replace(/\{\{.*?\}\}/gs, "")
    .replace(/\{%.*?%\}/gs, "");

  const dom = new JSDOM(`<body>${cleaned}</body>`);
  const markdown = walkNode(dom.window.document.body, formatName).trim();

  // Also resolve URLs in markdown links that were already in the source text
  // (not converted from HTML, so the DOM walker didn't process them)
  return markdown.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, linkText: string, href: string) => `[${linkText}](${resolveIesdpUrl(href, formatName)})`,
  );
}

/**
 * Strips all markup (HTML, markdown, liquid) from text. Used for ID generation.
 */
function stripAllMarkup(text: string): string {
  // Format name irrelevant — URLs are stripped anyway
  return htmlToMarkdown(text, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Markdown links
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Markdown bold
    .replace(/`([^`]+)`/g, "$1"); // Markdown code
}

/**
 * Applies ID_REPLACEMENTS to a string.
 */
function applyIdReplacements(input: string): string {
  let result = input;
  for (const [from, to] of Object.entries(ID_REPLACEMENTS)) {
    result = result.replaceAll(from, to);
  }
  return result;
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
  const iid = prefix + applyIdReplacements(stripAllMarkup(item.desc.toLowerCase()));

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
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }
  const first: unknown = data[0];
  return typeof first === "object" && first !== null && "desc" in first && "type" in first;
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
function loadDatafile(fpath: string, prefix: string, formatName: string): Map<string, StructureField> {
  log(`loading ${fpath}`);
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
      log(`Warning: offset mismatch in ${fpath}. Expected ${curOff}, got ${item.offset}`);
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
      desc: htmlToMarkdown(item.desc, formatName),
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
 * Formats a structure entry as a multiline JSDoc comment + OUTER_SET line.
 */
function formatStructureEntry(id: string, field: StructureField): string {
  const descLines = field.desc
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line !== "");

  const jsdocLines = [
    "/**",
    ` * @type ${field.type}`,
    ...descLines.map((line) => ` * ${line}`),
    " */",
  ];

  return `${jsdocLines.join("\n")}\nOUTER_SET ${id} = 0x${field.offset.toString(16)}`;
}

/**
 * Writes structure items to the appropriate output file.
 */
function writeStructureFile(formatName: string, items: Map<string, StructureField>, structuresDir: string): void {
  const dirName = getOutputDirName(formatName);
  const outputDir = path.join(structuresDir, dirName);
  const outputFile = path.join(outputDir, "iesdp.tph");

  fs.mkdirSync(outputDir, { recursive: true });

  const lines = [...items.entries()].map(
    ([id, field]) => formatStructureEntry(id, field),
  );

  fs.writeFileSync(outputFile, lines.join("\n") + "\n");
  log(`Generated ${outputFile}`);
}

/**
 * Processes format directories and generates structure offset files.
 */
function processFormatDirectories(fileFormatsDir: string, structuresDir: string): void {
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
      const newItems = loadDatafile(fpath, prefix, ff);

      for (const [k, v] of newItems) {
        items.set(k, v);
      }
    }

    writeStructureFile(ff, items, structuresDir);
  }
}

/**
 * Processes the feature block (output to fx/ directory).
 */
function processFeatureBlock(fileFormatsDir: string, structuresDir: string): void {
  const featureBlockPath = path.join(fileFormatsDir, "itm_v1", "feature_block.yml");
  if (!fs.existsSync(featureBlockPath)) {
    return;
  }
  const fxItems = loadDatafile(featureBlockPath, "FX_", "fx_v1");
  writeStructureFile("fx_v1", fxItems, structuresDir);
}

/**
 * Validates that parsed YAML is an array of item type entries.
 */
function isItemTypeArray(data: unknown): data is ItemTypeRaw[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }
  const first: unknown = data[0];
  return typeof first === "object" && first !== null && "code" in first && "type" in first;
}

/**
 * Generates an ID for an item type entry.
 * Uses custom 'id' field if present, otherwise derives from description.
 */
function getItemTypeId(item: ItemTypeRaw): string {
  if (item.id !== undefined) {
    return ITEM_TYPE_PREFIX + item.id;
  }

  const id = ITEM_TYPE_PREFIX + applyIdReplacements(stripAllMarkup(item.type.toLowerCase()));

  if (!/^[a-zA-Z0-9_]+$/.test(id)) {
    throw new ValidationError(`Invalid item type id generated: "${id}" from type: "${item.type}"`);
  }

  return id;
}

/**
 * Generates structures/item_types.tph from IESDP item_types.yml.
 */
function generateItemTypesFile(itemTypesPath: string, structuresDir: string): void {
  log(`loading ${itemTypesPath}`);
  const content = readFile(itemTypesPath);
  const parsed = yaml.load(content);

  if (!isItemTypeArray(parsed)) {
    throw new ValidationError(`Invalid item types data in ${itemTypesPath}`);
  }

  const lines: string[] = [];
  for (const item of parsed) {
    if (item.type.toLowerCase() === "unknown") {
      continue;
    }

    const code = parseInt(item.code, 16);
    if (Number.isNaN(code)) {
      throw new ValidationError(`Invalid item type code '${item.code}' for '${item.type}' in ${itemTypesPath}`);
    }

    const id = getItemTypeId(item);
    lines.push(`OUTER_SET ${id} = 0x${code.toString(16).padStart(2, "0")}`);
  }

  const outputFile = path.join(structuresDir, "item_types.tph");
  fs.writeFileSync(outputFile, lines.join("\n") + "\n");
  log(`Generated ${outputFile}`);
}

/**
 * Processes all structure definitions from IESDP.
 */
function processStructures(iesdpDir: string, structuresDir: string): void {
  const fileFormatsDir = path.join(iesdpDir, "_data", "file_formats");
  validateDirectory(fileFormatsDir, "File formats directory");

  processFormatDirectories(fileFormatsDir, structuresDir);
  processFeatureBlock(fileFormatsDir, structuresDir);

  const itemTypesPath = path.join(fileFormatsDir, "item_types.yml");
  if (fs.existsSync(itemTypesPath)) {
    generateItemTypesFile(itemTypesPath, structuresDir);
  }
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
      describe: "Opcode definition file (WeiDU tph)",
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
