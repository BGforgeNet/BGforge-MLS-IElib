/**
 * JSDoc to YAML Converter
 *
 * Parses JSDoc comments from WeiDU .tpa files and generates YAML files
 * for Jekyll documentation generation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parseWeiduJsDoc, WeiduFunction, JsDocParam } from './weidu-jsdoc-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Converts a WeiduFunction to YAML-compatible format.
 */
function functionToYaml(func: WeiduFunction): YamlFunction {
    const result: YamlFunction = {
        name: func.name,
        desc: func.description,
        type: func.type,
    };

    const intParams = func.params.filter((p) => p.varType === 'INT_VAR');
    const strParams = func.params.filter((p) => p.varType === 'STR_VAR');

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
        if (defaultValue.startsWith('~') && defaultValue.endsWith('~')) {
            defaultValue = defaultValue.slice(1, -1);
        }
        // Remove " delimiters
        if (defaultValue.startsWith('"') && defaultValue.endsWith('"')) {
            defaultValue = defaultValue.slice(1, -1);
        }
        // Skip empty defaults and sentinel values
        if (defaultValue !== '' && defaultValue !== '-1') {
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
        if (func.desc.includes('\n')) {
            lines.push('  desc: |');
            for (const line of func.desc.split('\n')) {
                lines.push(`    ${line}`);
            }
        } else {
            lines.push(`  desc: ${func.desc}`);
        }

        lines.push(`  type: ${func.type}`);

        if (func.int_params) {
            lines.push('  int_params:');
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
            lines.push('  string_params:');
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
            lines.push('  return:');
            for (const ret of func.return) {
                lines.push(`    - name: ${ret.name}`);
                lines.push(`      desc: ${ret.desc}`);
                lines.push(`      type: ${ret.type}`);
            }
        }

        lines.push('');
    }

    return lines.join('\n');
}

/**
 * Main function to process all .tpa files and generate YAML.
 */
function main(): void {
    const projectRoot = path.resolve(__dirname, '..');
    const functionsDir = path.join(projectRoot, 'functions');
    const outputDir = path.join(projectRoot, 'docs', '_data', 'functions');

    // Read sections.yml to get the list of expected files
    const sectionsPath = path.join(projectRoot, 'docs', '_data', 'sections.yml');
    const sectionsContent = fs.readFileSync(sectionsPath, 'utf-8');
    const sectionNames = [...sectionsContent.matchAll(/^- name: (\w+)/gm)].map((m) => m[1]);

    console.log(`Processing sections: ${sectionNames.join(', ')}`);

    for (const section of sectionNames) {
        const tpaPath = path.join(functionsDir, `${section}.tpa`);
        const yamlPath = path.join(outputDir, `${section}.yml`);

        if (!fs.existsSync(tpaPath)) {
            console.log(`  Skipping ${section}: ${tpaPath} not found`);
            continue;
        }

        console.log(`  Processing ${section}.tpa...`);

        const content = fs.readFileSync(tpaPath, 'utf-8');
        const functions = parseWeiduJsDoc(content);

        if (functions.length === 0) {
            console.log(`    No documented functions found in ${section}.tpa`);
            continue;
        }

        const yamlFunctions = functions.map(functionToYaml);
        const yamlContent = serializeYaml(yamlFunctions);

        fs.writeFileSync(yamlPath, yamlContent);
        console.log(`    Generated ${yamlPath} with ${functions.length} functions`);
    }

    console.log('Done!');
}

main();
