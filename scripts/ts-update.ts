#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { JSDOM } from 'jsdom';

/**
 * A mapping of short type identifiers to their corresponding TypeScript types.
 */
type TypeMapping = { [key: string]: string };

type Parameter = {
    name: string;
    type: string;
    ids?: string;
};

type ParsedData = {
    bg2: number;
    unknown?: boolean;
    no_result?: boolean;
    name: string;
    desc?: string;
    params?: Parameter[];
};

const typeMapping: TypeMapping = {
    s: "string",
    o: "ObjectPtr",
    i: "number",
    p: "Point",
    a: "Action",
    itmref: "ItmRef",
    splref: "SplRef",
};

/**
 * Prettifies code blocks
 * @param description function description
 * @returns updated description
 */
function processCodeBlocks(description: string): string {
    return description.replace(/```(.*?)```/gs, (_, code) => {
        const indentedCode = code
            .trim()
            .split("\n") // Split into lines
            .map(line => `  ${line}`) // Add extra indentation to each line
            .join("\n"); // Join back with line breaks
        return `\`\`\`weidu-baf\n${indentedCode}\n\`\`\``;
    });
}

/**
 * Read function yaml file, convert into a TS declaration
 * @param yamlFilePath action yaml file
 * @returns function declaration with JSDoc description
 */
function generateTypeScriptDeclaration(yamlFilePath: string): string | null {
    const fileContent = fs.readFileSync(yamlFilePath, 'utf-8');
    const parsedData = yaml.load(fileContent) as ParsedData;

    if (parsedData.bg2 !== 1) {
        console.log(`${yamlFilePath} is missing BG2 data. Skipping.`);
        return null;
    }

    if (parsedData.unknown || parsedData.no_result) {
        console.log(`Note: The file '${yamlFilePath}' is marked as unknown or has no result. Skipping.`);
        return null;
    }

    const functionName = parsedData.name;
    if (functionName === "Help") {
        console.log("Skipping Help() function, it's both action and trigger");
        return null;
    }

    let description = processCodeBlocks(parsedData.desc || "");
    // Replace all block-style comments with single-line comments
    description = description.replace(/\/\* (.*?) \*\//g, "// $1");

    const params: Parameter[] = parsedData.params || [];
    const paramLines: string[] = [];
    let unusedCount = 0;

    for (const param of params) {
        let paramName = param.name.toLowerCase() === "unused" ? `unused${unusedCount++}` : param.name;
        paramName = paramName === "GLOBAL" ? "global" : paramName;
        paramName = paramName === "STRREF" ? "strRef" : paramName.toLowerCase();

        // Try IDS, then mapping, then just type
        let paramType = param.ids ? param.ids : typeMapping[param.type];
        // Spell is an Action
        if (paramType == "Spell") {
            paramType = "SpellID";
        }
        // Weather is an Action
        if (paramType == "Weather") {
            paramType = "WeatherID";
        }
        // Just consistency
        if (paramType == "ShoutIDS") {
            paramType = "ShoutID";
        }
        paramLines.push(`${paramName}: ${paramType}`);
    }

    const paramsStr = paramLines.join(", ");
    const output = `/**\n * ${description.trim()}\n */\ndeclare function ${functionName}(${paramsStr}): void;`;
    return output;
}

/**
 * Processes a directory of YAML files and generates TypeScript declarations.
 * @param directory Path to the YAML directory.
 * @param outputFile Output file path.
 */
function processActionFiles(directory: string, outputFile: string): void {
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
        if (!file.toLowerCase().endsWith('.yml')) continue;

        const yamlFilePath = path.join(directory, file);
        const declaration = generateTypeScriptDeclaration(yamlFilePath);

        if (declaration) {
            tsOutput.push(declaration);
            console.log(`Processed: ${yamlFilePath}`);
        }
    }

    fs.writeFileSync(outputFile, tsOutput.join("\n\n"), 'utf-8');
    console.log(`Output written to ${outputFile}`);
}

/**
 * Parse trigger definitions and generate TS declarations
 * @param triggerFilePath Path to the triggers file
 * @param triggerOutputFilePath Path to save the TypeScript declarations
 */
/**
 * Parse trigger definitions and generate TS declarations
 * @param triggerFilePath Path to the triggers file
 * @param triggerOutputFilePath Path to save the TypeScript declarations
 */
function processTriggers(triggerFilePath: string, triggerOutputFilePath: string): void {
    const fileContent = fs.readFileSync(triggerFilePath, 'utf-8');

    console.log("Debug: Loaded triggers file.");

    // Parse the HTML content
    const dom = new JSDOM(fileContent);
    const textContent = dom.window.document.body.textContent || '';

    console.log("Debug: Extracted full text content from HTML.");

    // Split the text content into blocks based on lines starting with '0x'
    const triggerBlocks = textContent.split(/\s+(?=0x[0-9A-Fa-f]{4})/).map(block => block.trim()).filter(Boolean);

    console.log(`Debug: Found ${triggerBlocks.length} trigger blocks.`);

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

    triggerBlocks.forEach((block, index) => {
        try {
            const declaration = convertTriggerBlockToDeclaration(block);
            tsOutput.push(declaration);
        } catch (error) {
            console.warn(`Warning: Failed to process block #${index + 1}:`, error.message);
            console.warn(block);
        }
    });

    if (tsOutput.length === 1) { // Only the header exists
        console.error("Error: No valid trigger blocks were processed.");
    } else {
        console.log(`Debug: Successfully generated ${tsOutput.length - 1} declarations.`);
    }

    fs.writeFileSync(triggerOutputFilePath, tsOutput.join("\n\n"), 'utf-8');
    console.log(`Trigger declarations written to ${triggerOutputFilePath}`);
}


/**
 * Convert trigger description declaration
 * @param block Trigger description block, starting with 0x
 * @returns TS declaration with JSdoc
 */
function convertTriggerBlockToDeclaration(block: string): string {
    const lines = block.split("\n").map(line => line.trim());

    const header = lines[0];
    const description = lines.slice(1).join(" ");

    // Extract the function name and parameters from the header
    const headerMatch = header.match(/^0x[0-9A-Fa-f]+ (\w+)\((.*?)\)$/);
    if (!headerMatch) {
        throw new Error(`Invalid header format: "${header}"`);
    }

    const [_, triggerName, params] = headerMatch;
    const paramsStr = parseTriggerParameters(params);

    return `/**\n * ${description.trim()}\n */\ndeclare function ${triggerName}(${paramsStr}): boolean;`;
}

/**
 * Convert trigger parameters string to TS format
 * @param params trigger parameters string
 * @returns parameters string in TS format
 */
function parseTriggerParameters(params: string): string {
    // no parameters
    if (params == "") {
        return params;
    }
    // some parameters
    return params.split(",").map(param => {
        // Split each parameter into 'type' and 'name'
        const [type, nameWithDetails] = param.split(":").map(part => part.trim());
        if (!type || !nameWithDetails) {
            throw new Error(`Invalid parameter format: "${param}"`);
        }

        // Extract name and specific type if present (e.g., "I:Style*AStyles")
        const [name, specificType] = nameWithDetails.split("*").map(part => part.trim());

        // Ensure the parameter name starts with a lowercase letter
        const sanitizedName = name.replace(/\s+/g, ""); // Remove whitespace
        let formattedName = sanitizedName.charAt(0).toLowerCase() + sanitizedName.slice(1);
        // class is a reserved name
        if (formattedName == "class") {
            formattedName = "classID";
        }
        // iD => ID
        if (formattedName == "iD") {
            formattedName = "id";
        }

        // Use the specific type if present, otherwise map from typeMapping
        let tsType = specificType ? specificType : typeMapping[type.toLowerCase()];
        if (!tsType) {
            throw new Error(`Unknown type: "${type}" or "${specificType}"`);
        }
        // Spell is Action
        if (tsType == "Spell") {
            tsType = "SpellID";
        }
        // Just consistency
        if (tsType == "ShoutIDS") {
            tsType = "ShoutID";
        }

        // Format the parameter as "name: tsType"
        return `${formattedName}: ${tsType}`;
    }).join(", ");
}

const argv = yargs(hideBin(process.argv))
    .scriptName("ts-update")
    .usage("Usage: $0 <actions_directory> <actions_output_file> <triggers_file> <triggers_output_file>")
    .demandCommand(4)
    .help()
    .parseSync(); // Enforce synchronous parsing

const [actionsDirectory, actionsOutputFile, triggersFile, triggersOutputFile] = argv._ as [string, string, string, string];

processActionFiles(actionsDirectory, actionsOutputFile);
processTriggers(triggersFile, triggersOutputFile);
