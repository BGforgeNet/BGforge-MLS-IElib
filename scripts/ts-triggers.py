#!/usr/bin/env python3

import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup


def camel_case(line):
    return line[0].lower() + line[1:]


"""
 Parses a parameter, returns param_name, param_type
"""


def parse_param(param):
    # Clean up input
    param = param.strip()

    # Split on ':'
    param_type, param_name = param.split(":")

    # Remove '*' from the param_name if present
    param_name = param_name.rstrip("*")

    # Special handling for 'I:Style*AStyles'
    if "*" in param_name:
        param_name, param_type = param_name.split("*", 1)  # Split by '*' and assign correctly

    # Additional type mappings
    if param_name == "Object":
        param_name = "who"

    if param_type == "O":
        param_type = "ObjectPtr"

    if param_name == "NPC":
        param_name = "npc"

    if param_type == "AREATYPE":
        param_name = "areatype"
        param_type = "AreaType"

    if param_type == "BOOLEAN":
        param_type = "boolean"

    if param_type == "Spell":
        param_type = "SpellID"

    if param_type == "S":
        param_type = "string"
    if param_type == "I":
        param_type = "number"

    if param_name == "ResRef":
        param_type = "Resref"
        param_name = "resource"

    # Convert to camelCase (if you have a function for that)
    param_name = camel_case(param_name)

    if param_name == "class":
        param_name = "classID"

    # Remove spaces from param_name
    param_name = param_name.replace(" ", "")

    return param_name, param_type


def parse_declaration(lines):
    """
    Parse a single declaration block into its components.

    Args:
        lines (list): Lines of the declaration block.

    Returns:
        tuple: (function_name, description, parameters)
    """
    header = lines[0]
    description = " ".join(lines[1:]).replace("?", ".").strip()

    # Parse the function name and parameter list
    match = re.match(r"0x[0-9A-Fa-f]{4}\s+(\w+)\((.*)\)", header)
    if not match:
        raise ValueError(f"Invalid declaration header: {header}")

    func_name, params = match.groups()

    # If params is empty, return an empty parameter list
    if not params.strip():
        return func_name, description, []

    param_list = params.split(",")

    parsed_params = []
    for param in param_list:
        param_name, param_type = parse_param(param)

        parsed_params.append((param_name.strip(), param_type))

    return func_name, description, parsed_params


def convert_to_declaration(input_file, output_file):
    """
    Convert the source declarations into TypeScript declarations.

    Args:
        input_file (str): Path to the input file.
        output_file (str): Path to the output file.
    """
    input_path = Path(input_file)
    output_path = Path(output_file)

    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_file}")

    with open(input_path, "r") as infile:
        html = infile.read()
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    lines = text.splitlines()

    declarations = []
    current_block = []

    for line in lines:
        if line.strip() == "":
            continue
        if line.startswith("0x"):
            if current_block:
                declarations.append(current_block)
                current_block = []
        current_block.append(line.strip())

    if current_block:
        declarations.append(current_block)

    header = """import type { ObjectPtr, Resref } from "../index";
import { Align } from "./align.ids";
import { AStyles } from "./astyles.ids";
import { AreaType } from "./areatype.ids";
import { Class } from "./class.ids";
import { Damages } from "./damages.ids";
import { DIFFLEV } from "./difflev.ids";
import { EA } from "./ea.ids";
import { Gender } from "./gender.ids";
import { General } from "./general.ids";
import { Happy } from "./happy.ids";
import { HotKey } from "./hotkey.ids";
import { KIT } from "./kit.ids";
import { MODAL } from "./modal.ids";
import { NPC } from "./npc.ids";
import { SHOUTIDS } from "./shoutids.ids";
import { SLOTS } from "./slots.ids";
import { Specific } from "./specific.ids";
import { State } from "./state.ids";
import { Stats } from "./stats.ids";
import { Time } from "./time.ids";
import { TimeODay } from "./timeoday.ids";
import { SpellID } from "..";
import { Race } from "./race.ids";
import { Reaction } from "./reaction.ids";
"""
    output = [header]

    for decl in declarations:
        try:
            func_name, description, parameters = parse_declaration(decl)
            jsdoc = f"/**\n * {description}\n"
            for param_name, param_type in parameters:
                jsdoc += f" * @param {param_name} {param_type}\n"
            jsdoc += "*/"
            ts_function = (
                f"declare function {func_name}({', '.join(f'{name}: {ptype}' for name, ptype in parameters)}): boolean;"
            )
            if func_name == "Help":
                print("skipping Help() function, it's both action and trigger")
            else:
                output.append(jsdoc + "\n" + ts_function)
        except ValueError as e:
            print(f"Warning: Skipping invalid declaration: {e}")

    with open(output_path, "w") as outfile:
        outfile.write("\n\n".join(output))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python ts-triggers.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    try:
        convert_to_declaration(input_file, output_file)
        print(f"Conversion completed. Output saved to {output_file}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
