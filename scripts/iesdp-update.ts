#!/usr/bin/env tsx

/**
 * IESDP Update Script (CLI Entry Point)
 *
 * Generates WeiDU constant definitions from IESDP data:
 * 1. Opcodes from HTML files with YAML frontmatter -> opcode.tph
 * 2. Structure offsets from YAML files -> structures/<type>/iesdp.tph
 * 3. Item types from YAML -> structures/item_types.tph
 */

import * as fs from "fs";
import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { validateDirectory } from "./utils.js";
import { generateOpcodeFile } from "./iesdp-opcode.js";
import { processStructures } from "./iesdp-structure.js";
import { generateItemTypesFile } from "./iesdp-item-types.js";

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

  // Item types (called from processStructures internally, but also available standalone)
  const itemTypesPath = path.join(iesdpDir, "_data", "file_formats", "item_types.yml");
  if (fs.existsSync(itemTypesPath)) {
    generateItemTypesFile(itemTypesPath, structuresDir);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
