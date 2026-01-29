/**
 * Shared utilities for build scripts.
 */

import * as fs from "fs";

/**
 * Reads a file and returns its content, throwing descriptive errors.
 */
export function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Validates that a directory exists.
 */
export function validateDirectory(dirPath: string, description: string): void {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`${description} not found: ${dirPath}`);
  }
  if (!fs.statSync(dirPath).isDirectory()) {
    throw new Error(`${description} is not a directory: ${dirPath}`);
  }
}

/** Logs a message to stdout. */
export function log(message: string): void {
  process.stdout.write(`${message}\n`);
}
