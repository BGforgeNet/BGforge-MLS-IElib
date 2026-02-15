/**
 * Ambient declarations for functions implemented outside TypeScript.
 * These exist in the WeiDU/IE runtime, not in any .ts module.
 */

import type { StrRef } from "./index";

/**
 * Wrapper for TRA references. Use instead of `@`.
 *
 * TRA references are a WeiDU compile-time concept -- they resolve to
 * TLK indices (StrRefs) at install time.
 *
 * @param index tra reference number
 */
export declare function tra(index: number): StrRef;

/**
 * Wrapper for direct TLK references. Use instead of `#`.
 *
 * @param index TLK string index
 */
export declare function tlk(index: number): StrRef;
