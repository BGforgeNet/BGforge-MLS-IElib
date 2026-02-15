/**
 * IElib TypeScript bindings -- core types.
 *
 * Type branding strategy:
 * - Numeric IDS types use IE<number, "..."> for nominal safety. Custom values: `42 as SpellID`.
 * - String resref types use `string & {}` (unbranded) -- resrefs are raw string literals
 *   and branding would force a cast on every usage with no practical benefit.
 * - Action uses a branded interface so ActionOverride can enforce real action calls.
 * - IDS type names use a *ID suffix when a same-named trigger/action function exists
 *   (e.g. ClassID vs Class() trigger). Otherwise bare names are used.
 */

/**
 * Type branding
 */
type Brand<B> = { __brand: B };
export type IE<T, B> = T & Brand<B>;

/**
 * Object specifier, e.g. [ENEMY.0.0.MAGE].
 *
 * No validation for now.
 */
export class ObjectSpec {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
/**
 * Wrapper for object specifiers.
 *
 * Allows using object specifier strings like `[ENEMY.0.0.MAGE]` in Typescript.
 *
 * Also allows to use death variables (strings up to 17 characters - limited by SPRITE_IS_DEAD vars).
 *
 * No validation for now.
 * @param spec Object specifier string
 * @returns object specifier, compatible with `ObjectPtr` type
 */
export function obj(spec: string) {
  return new ObjectSpec(spec);
}

// --- MLS sync surface start ---
// These types must be structurally compatible with BGforge MLS.
// Both projects define them independently; keep shapes and brand strings identical.

/**
 * String reference (TLK index).
 *
 * Branded to prevent accidentally passing a plain number where a text
 * reference is expected.
 */
export type StrRef = number & { __brand: "StrRef" };

/** Branded type for engine actions. Engine action functions must return this type. */
export interface Action {
  readonly __brand: "Action";
}

// --- MLS sync surface end ---

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

/**
 * Game Object
 */
export declare type ObjectPtr = IE<string, "ObjectPtr"> | ObjectSpec;

/**
 * Area point/location.
 */
export type Point = `[${number}.${number}]`;

/** Spell.ids */
export type SpellID = IE<number, "SpellID">;

/**
 * Resource reference, up to 8 characters.
 *
 * Not branded with IE<T,B> intentionally: resrefs are almost always raw string literals,
 * and branding would require a cast on every usage (e.g. "SWORD01" as ItmRef).
 * Unlike numeric IDS types which have pre-typed constants, there is no finite set of valid resrefs.
 */
export type ResRef = string & {};
/** SPL resource reference, up to 8 characters. */
export type SplRef = string & {};
/** ITM resource reference, up to 8 characters. */
export type ItmRef = string & {};
/** ARE resource reference, up to 8 characters. */
export type AreRef = string & {};
/** CRE resource reference, up to 8 characters. */
export type CreRef = string & {};

/** Facing direction (0-15, clockwise from S). */
export type Direction = IE<number, "Direction">;

/**
 * Variable and timers scope: GLOBAL, LOCALS, MYAREA, or area resref.
 *
 * Not narrowed to a union: scope accepts any area resref as a string,
 * so the set of valid values is open-ended.
 */
export type Scope = string & {};
export const GLOBAL: Scope = "GLOBAL";
export const LOCALS: Scope = "LOCALS";
export const MYAREA: Scope = "MYAREA";
