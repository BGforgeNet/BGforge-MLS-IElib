#!/usr/bin/env tsx

/**
 * IESDP Update Script
 *
 * Generates WeiDU constant definitions from IESDP data:
 * 1. Opcodes from HTML files with YAML frontmatter -> opcode.tpp
 * 2. Structure offsets from YAML files -> structures/<type>/iesdp.tpp
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import matter from "gray-matter";

// Constants
const SKIP_OPCODE_NAMES = ["empty", "crash", "unknown"];

// Types
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
function opcodeName(name: string): string {
  // Replacements applied anywhere in the string
  const replacements: Record<string, string> = {
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

  // Prefixes to strip from the left
  const lstripPrefixes = [
    "item_",
    "graphics_",
    "spell_effect_", // should be before spell_
    "spell_",
    "stat_",
    "state_",
    "summon_",
  ];

  let result = name.toLowerCase();

  // Apply replacements
  for (const [from, to] of Object.entries(replacements)) {
    result = result.split(from).join(to);
  }

  // Collapse multiple underscores
  result = result.replace(/_{2,}/g, "_");

  // Strip leading/trailing underscores
  result = result.replace(/^_+|_+$/g, "");

  // Strip known prefixes
  for (const prefix of lstripPrefixes) {
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
  const content = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(content);
  const data = parsed.data as OpcodeFrontmatter;

  if (data.n === undefined || !data.opname) {
    return null;
  }

  return data;
}

/**
 * Generates the opcode.tpp file from IESDP opcode definitions.
 */
function generateOpcodeFile(iesdpDir: string, outputFile: string): void {
  const opcodeDir = path.join(iesdpDir, "_opcodes");
  const files = findFiles(opcodeDir, ".html");
  const opcodes: OpcodeFrontmatter[] = [];

  // Parse all opcode files
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
    let name = opcodeName(o.opname);

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

  // Generate output with trailing newline to match Python output
  let output = "";
  for (const [name, num] of opcodesUnique) {
    output += `OPCODE_${name} = ${num}\n`;
  }
  output += "\n"; // Trailing newline

  fs.writeFileSync(outputFile, output);
  console.log(`Generated ${outputFile} with ${opcodesUnique.size} opcodes`);
}

/**
 * Generates the prefix for a structure constant.
 * E.g., "eff_v2" + "body.yml" -> "EFF2_"
 */
function getPrefix(fileVersion: string, dataFileName: string): string {
  const base = fileVersion.replace(/_v.*/, "");
  let version = fileVersion.replace(/.*_v/, "");
  version = version.replace(".", "");
  if (version === "1") {
    version = "";
  }

  // Custom prefix for some data structures
  const fbase = dataFileName.replace(".yml", "");
  const fbaseMap: Record<string, string> = {
    header: "",
    body: "",
    extended_header: "head",
  };
  const suffix = fbaseMap[fbase] ?? fbase;

  let prefix = `${base}${version}_`;
  if (suffix !== "") {
    prefix = `${prefix}${suffix}_`;
  }

  return prefix.toUpperCase();
}

/**
 * Strips markdown links and HTML tags from text, keeping only the text content.
 * E.g., "[flags](#header_flags)" -> "flags"
 * E.g., "<b><a name='x'>text</a></b>" -> "text"
 */
function stripMarkupFromText(text: string): string {
  // Replace markdown links [text](url) with just text
  let result = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Strip HTML tags
  result = result.replace(/<[^>]+>/g, "");

  return result;
}

/**
 * Generates a constant ID from a structure item.
 */
function getId(item: StructureItem, prefix: string): string {
  // Custom IElib id
  if (item.id) {
    return prefix + item.id;
  }

  // No custom id, constructing from description
  let iid = item.desc.toLowerCase();

  // Strip markdown links and HTML tags
  iid = stripMarkupFromText(iid);

  // Custom replacements
  const replacements: Record<string, string> = {
    "probability ": "probability",
    "usability ": "usability",
    "parameter ": "parameter",
    "resource ": "resource",
    alternative: "alt",
    ".": "",
    " ": "_",
  };

  for (const [from, to] of Object.entries(replacements)) {
    iid = iid.split(from).join(to);
  }

  iid = prefix + iid;

  // Validate: id must be alnum + '_' only
  if (!/^[a-zA-Z0-9_]+$/.test(iid)) {
    console.error(`Bad id: "${iid}". Aborting.`);
    process.exit(1);
  }

  return iid;
}

/**
 * Computes the size of a structure field.
 */
function getSize(item: StructureItem): number {
  if (item.length !== undefined) {
    return item.length;
  }

  const sizeMap: Record<string, number> = {
    byte: 1,
    char: 1,
    word: 2,
    dword: 4,
    resref: 8,
    strref: 4,
  };

  let size = sizeMap[item.type];
  if (size === undefined) {
    console.error(`Unknown type: "${item.type}". Aborting.`);
    process.exit(1);
  }

  if (item.mult !== undefined) {
    size = size * item.mult;
  }

  return size;
}

/**
 * Loads a structure data file and computes offsets.
 */
function loadDatafile(fpath: string, prefix: string): Map<string, string> {
  console.log(`loading ${fpath}`);
  const content = fs.readFileSync(fpath, "utf-8");
  const data = yaml.load(content) as StructureItem[];

  let curOff = 0;
  if (data[0]?.offset !== undefined) {
    curOff = data[0].offset;
  }

  const items = new Map<string, string>();

  for (const item of data) {
    if (item.offset !== undefined && item.offset !== curOff) {
      console.log(`Error: offset mismatch. Expected ${curOff}, got ${item.offset} for ${JSON.stringify(item)}`);
    }

    const size = getSize(item);

    // Skip unused/unknown fields
    if (item.unused || item.unknown) {
      curOff += size;
      continue;
    }

    const iid = getId(item, prefix);
    items.set(iid, `0x${curOff.toString(16)}`);
    curOff += size;
  }

  return items;
}

/**
 * Writes structure items to the appropriate output file.
 */
function dumpItems(formatName: string, items: Map<string, string>, structuresDir: string): void {
  // formatName is e.g. "sto_v1" -> output dir "sto"
  const base = formatName.replace(/_v.*/, "");
  const outputDir = path.join(structuresDir, base);
  const outputFile = path.join(outputDir, "iesdp.tpp");

  fs.mkdirSync(outputDir, { recursive: true });

  let text = "";
  for (const [id, offset] of items) {
    text += `${id} = ${offset}\n`;
  }
  text += "\n"; // Trailing newline

  fs.writeFileSync(outputFile, text);
  console.log(`Generated ${outputFile}`);
}

/**
 * Processes all structure definitions from IESDP.
 */
function processStructures(iesdpDir: string, structuresDir: string): void {
  const fileFormatsDir = path.join(iesdpDir, "_data", "file_formats");
  const formats = fs.readdirSync(fileFormatsDir);

  // Sort formats so higher versions come first, then v1 overwrites
  // This matches the original Python behavior where filesystem order
  // resulted in v1 being processed last
  formats.sort((a, b) => b.localeCompare(a));

  for (const ff of formats) {
    const ffDir = path.join(fileFormatsDir, ff);
    if (!fs.statSync(ffDir).isDirectory()) {
      continue;
    }

    const items = new Map<string, string>();
    // Sort files alphabetically for deterministic output across systems
    const files = fs.readdirSync(ffDir).sort();

    for (const f of files) {
      // Feature blocks handled separately
      if (f === "feature_block.yml") {
        continue;
      }

      const prefix = getPrefix(ff, f);
      const fpath = path.join(ffDir, f);
      const newItems = loadDatafile(fpath, prefix);

      // Merge new items
      for (const [k, v] of newItems) {
        items.set(k, v);
      }
    }

    dumpItems(ff, items, structuresDir);
  }

  // Feature block (output to fx/ directory)
  const featureBlockPath = path.join(fileFormatsDir, "itm_v1", "feature_block.yml");
  if (fs.existsSync(featureBlockPath)) {
    const fxItems = loadDatafile(featureBlockPath, "FX_");
    dumpItems("fx_v1", fxItems, structuresDir);
  }
}

// Main entry point
const argv = yargs(hideBin(process.argv))
  .scriptName("iesdp-update")
  .usage("Usage: $0 -s <iesdp_dir> --opcode_file <opcode_file>")
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
  .help()
  .parseSync();

const iesdpDir = argv.s;
const opcodeFile = argv.opcode_file;
const structuresDir = "structures";

// Generate opcodes
generateOpcodeFile(iesdpDir, opcodeFile);

// Generate structures
processStructures(iesdpDir, structuresDir);
