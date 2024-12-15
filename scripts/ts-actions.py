#!/usr/bin/env python3

import yaml
import sys
import os
import re
from typing import Optional, List

def generate_typescript_declaration(yaml_file_path: str) -> Optional[str]:
    """
    Generate a TypeScript declaration from a YAML file.

    Args:
        yaml_file_path (str): Path to the YAML file.

    Returns:
        Optional[str]: TypeScript declaration as a string, or None if the file is marked to be skipped.
    """
    # Read the YAML input from the specified file
    with open(yaml_file_path, 'r', encoding='utf-8') as file:
        parsed_data = yaml.safe_load(file)

    # Check if 'unknown' or 'no_result' is set to true
    if parsed_data.get('unknown', False) or parsed_data.get('no_result', False):
        print(f"Note: The file '{yaml_file_path}' is marked as unknown or has no result. Skipping.")
        return None

    # Define default type mappings
    type_mapping = {
        's': 'string',
        'o': 'ObjectPtr',
        'i': 'number',
        'p': 'Point',  # Map 'p' to 'Point'
        'a': 'Action'  # Map 'a' to 'Action'
    }

    # Extract function details
    function_name = parsed_data['name']
    if function_name == "Help":
        print("skipping Help() function, it's both action and trigger")
        return None

    description = parsed_data.get('desc', '')

    # Replace `/* ... */` comment style with `// ...` in description
    description = re.sub(r'/\* (.*?) \*/', r'// \1', description)

    # Add indentation and language tag for code blocks
    description = re.sub(r'```(.*?)```', lambda match: format_code_block(match.group(1)), description, flags=re.DOTALL)

    params = parsed_data.get('params', [])

    # Format parameters with type mappings, converting STRREF name to strRef and GLOBAL to global
    param_lines = []
    for param in params:
        # Special cases for parameter names
        if param['name'] == "STRREF":
            param_name = "strRef"
        elif param['name'] == "GLOBAL":
            param_name = "global"
        else:
            param_name = param['name'][0].lower() + param['name'][1:]
        
        # Use the type from the mapping or default to the provided type
        param_type = type_mapping.get(param['type'], param['type'])
        
        param_line = f"{param_name}: {param_type}"
        param_lines.append(param_line)

    # Join parameters into a string
    params_str = ", ".join(param_lines)

    # Format the output with imports and without @param tags
    output = f"""/**
 * {description.strip()}
 */
declare function {function_name}({params_str}): void;
"""

    return output

def format_code_block(content: str) -> str:
    """
    Format the code block with `weidu-baf` and proper indentation.

    Args:
        content (str): The content of the code block.

    Returns:
        str: The formatted code block with `weidu-baf` language tag and indented lines.
    """
    # Add `weidu-baf` language identifier and indent each line within the code block
    indented_content = '\n'.join(f'  {line}' for line in content.strip().splitlines())
    return f'```weidu-baf\n{indented_content}\n```'

def process_files(directory: str, start_number: int, stop_number: int, output_file: str) -> None:
    """
    Process a range of YAML files in a specified directory and write the generated TypeScript declarations to an output file.

    Args:
        directory (str): The directory where YAML files are located.
        start_number (int): The starting number for YAML file range.
        stop_number (int): The ending number for YAML file range.
        output_file (str): The path to the output file.
    """
    # Buffer for all TypeScript output
    ts_output: List[str] = [
        'import type { GObject, Point, Action } from "../index";\n'
    ]

    # Process each YAML file in the specified directory and append the output to the buffer
    for i in range(start_number, stop_number + 1):
        yaml_file_path = os.path.join(directory, f"{i}.yml")
        if os.path.exists(yaml_file_path):
            declaration = generate_typescript_declaration(yaml_file_path)
            if declaration:
                ts_output.append(declaration)
                print(f"Processed: {yaml_file_path}")
        else:
            print(f"File '{yaml_file_path}' not found. Skipping.")

    # Write all buffered output at once to the file
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write("\n\n".join(ts_output))
        print(f"Output written to {output_file}")

if __name__ == "__main__":
    # Check if the correct number of arguments is provided
    if len(sys.argv) != 5:
        print("Usage: python generate_ts.py <directory> <start_number> <stop_number> <output_file>")
        sys.exit(1)

    # Parse command-line arguments
    directory = sys.argv[1]
    start_number = int(sys.argv[2])
    stop_number = int(sys.argv[3])
    output_file = sys.argv[4]

    # Process the files
    process_files(directory, start_number, stop_number, output_file)
