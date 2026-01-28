#!/usr/bin/env tsx

/**
 * JSDoc to YAML Converter
 *
 * Parses JSDoc comments from WeiDU .tpa files and generates YAML files
 * for Jekyll documentation generation.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";
import { parseWeiduJsDoc, WeiduFunction, JsDocParam } from "./weidu-jsdoc-parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Logs a message to stdout. */
function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

// Types
interface YamlParam {
  name: string;
  desc: string;
  type: string;
  required?: number;
  default?: string;
}

interface YamlReturn {
  name: string;
  type: string;
  desc: string;
}

interface YamlFunction {
  name: string;
  desc: string;
  type: string;
  int_params?: YamlParam[];
  string_params?: YamlParam[];
  return?: YamlReturn[];
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
 * Converts a WeiduFunction to YAML-compatible format.
 */
function functionToYaml(func: WeiduFunction): YamlFunction {
  const result: YamlFunction = {
    name: func.name,
    desc: func.description,
    type: func.type,
  };

  const intParams = func.params.filter((p) => p.varType === "INT_VAR");
  const strParams = func.params.filter((p) => p.varType === "STR_VAR");

  if (intParams.length > 0) {
    result.int_params = intParams.map(paramToYaml);
  }

  if (strParams.length > 0) {
    result.string_params = strParams.map(paramToYaml);
  }

  if (func.returns.length > 0) {
    result.return = func.returns.map((ret) => ({
      name: ret.name,
      type: ret.type,
      desc: ret.description,
    }));
  }

  return result;
}

/**
 * Converts a JsDocParam to YAML param format.
 */
function paramToYaml(param: JsDocParam): YamlParam {
  const result: YamlParam = {
    name: param.name,
    desc: param.description,
    type: param.type,
  };

  if (param.required) {
    result.required = 1;
  } else if (param.default !== undefined) {
    // Clean up the default value - remove WeiDU string delimiters
    let defaultValue = param.default;

    // Remove ~ delimiters
    if (defaultValue.startsWith("~") && defaultValue.endsWith("~")) {
      defaultValue = defaultValue.slice(1, -1);
    }

    // Remove " delimiters
    if (defaultValue.startsWith('"') && defaultValue.endsWith('"')) {
      defaultValue = defaultValue.slice(1, -1);
    }

    // Skip empty defaults and sentinel values
    if (defaultValue !== "" && defaultValue !== "-1") {
      result.default = defaultValue;
    }
  }

  return result;
}

/**
 * Serializes YAML manually to match the original format exactly.
 */
function serializeYaml(functions: YamlFunction[]): string {
  const lines: string[] = [];

  // Sort functions alphabetically by name
  const sorted = [...functions].sort((a, b) => a.name.localeCompare(b.name));

  for (const func of sorted) {
    lines.push(`- name: ${func.name}`);

    // Handle multi-line descriptions with YAML block scalar
    if (func.desc.includes("\n")) {
      lines.push("  desc: |");
      for (const line of func.desc.split("\n")) {
        lines.push(`    ${line}`);
      }
    } else {
      lines.push(`  desc: ${func.desc}`);
    }

    lines.push(`  type: ${func.type}`);

    if (func.int_params) {
      lines.push("  int_params:");
      for (const param of func.int_params) {
        lines.push(`    - name: ${param.name}`);
        lines.push(`      desc: ${param.desc}`);
        lines.push(`      type: ${param.type}`);
        if (param.required !== undefined) {
          lines.push(`      required: ${param.required}`);
        }
        if (param.default !== undefined) {
          lines.push(`      default: ${param.default}`);
        }
      }
    }

    if (func.string_params) {
      lines.push("  string_params:");
      for (const param of func.string_params) {
        lines.push(`    - name: ${param.name}`);
        lines.push(`      desc: ${param.desc}`);
        lines.push(`      type: ${param.type}`);
        if (param.required !== undefined) {
          lines.push(`      required: ${param.required}`);
        }
        if (param.default !== undefined) {
          lines.push(`      default: ${param.default}`);
        }
      }
    }

    if (func.return) {
      lines.push("  return:");
      for (const ret of func.return) {
        lines.push(`    - name: ${ret.name}`);
        lines.push(`      desc: ${ret.desc}`);
        lines.push(`      type: ${ret.type}`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

interface SectionInfo {
  name: string;
  title: string;
  desc: string;
}

/**
 * Parses sections.yml to get section metadata.
 */
function parseSections(content: string): SectionInfo[] {
  const parsed = yaml.load(content);
  if (!Array.isArray(parsed)) {
    throw new Error("sections.yml must be an array");
  }
  return parsed.map((item: unknown, index: number) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`Invalid section entry at index ${index} in sections.yml`);
    }
    const obj = item as Record<string, unknown>;
    if (typeof obj.name !== "string" || typeof obj.title !== "string") {
      throw new Error(`Section at index ${index} must have 'name' and 'title' string fields`);
    }
    const desc = typeof obj.desc === "string" ? obj.desc : "";
    return {
      name: obj.name,
      title: obj.title,
      desc,
    };
  });
}

/**
 * Generates a markdown page for a section.
 */
function generateSectionPage(section: SectionInfo, navOrder: number): string {
  return `---
title: ${section.title}
layout: functions
section: ${section.name}
nav_order: ${navOrder + 1}
permalink: /${section.name}/
description: ${section.desc}
---
`;
}

/**
 * Processes all .tpa files and generates YAML documentation and pages.
 */
function main(): void {
  const projectRoot = path.resolve(__dirname, "..");
  const functionsDir = path.join(projectRoot, "functions");
  const dataOutputDir = path.join(projectRoot, "docs", "_data", "functions");
  const pagesOutputDir = path.join(projectRoot, "docs", "_pages");
  fs.mkdirSync(dataOutputDir, { recursive: true });
  fs.mkdirSync(pagesOutputDir, { recursive: true });

  // Read sections.yml to get the list of expected files
  const sectionsPath = path.join(projectRoot, "docs", "_data", "sections.yml");
  const sectionsContent = readFile(sectionsPath);
  const sections = parseSections(sectionsContent);

  log(`Processing sections: ${sections.map((s) => s.name).join(", ")}`);

  let processedCount = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const tpaPath = path.join(functionsDir, `${section.name}.tpa`);
    const yamlPath = path.join(dataOutputDir, `${section.name}.yml`);
    const pagePath = path.join(pagesOutputDir, `${section.name}.md`);

    if (!fs.existsSync(tpaPath)) {
      log(`  Skipping ${section.name}: ${tpaPath} not found`);
      continue;
    }

    log(`  Processing ${section.name}.tpa...`);

    const content = readFile(tpaPath);
    const functions = parseWeiduJsDoc(content);

    if (functions.length === 0) {
      log(`    No documented functions found in ${section.name}.tpa`);
      continue;
    }

    const yamlFunctions = functions.map(functionToYaml);
    const yamlContent = serializeYaml(yamlFunctions);

    fs.writeFileSync(yamlPath, yamlContent);
    log(`    Generated ${yamlPath} with ${functions.length} functions`);

    // Generate page
    const pageContent = generateSectionPage(section, i + 1);
    fs.writeFileSync(pagePath, pageContent);
    log(`    Generated ${pagePath}`);

    processedCount++;
  }

  log(`Done! Processed ${processedCount} sections.`);
}

// Run main when executed directly
try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
