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

/**
 * Wrapper for TRA references. Use instead of `@`
 *
 * @param index tra reference number
 */
export declare function tra(index: number): number;

/**
 * Game Object
 */
export declare type ObjectPtr = IE<string, "ObjectPtr"> | ObjectSpec;

/**
 * Area point/location.
 */
export type Point = `[${number}.${number}]`;

/**
 * Action ID.
 */
export type Action = void;

/** Spell.ids */
export type SpellID = number & {};

/** Resource reference, up to 8 characters. */
export type ResRef = string & {};
/** SPL resource reference, up to 8 characters. */
export type SplRef = string & {};
/** ITM resource reference, up to 8 characters. */
export type ItmRef = string & {};

/**
 * Variable and timers scope.
 * "GLOBAL" | "LOCAL" | "MYAREA" | Area RESREF
 */
export type Scope = "GLOBAL" | "LOCALS" | "MYAREA";

/**
 * "GLOBAL"
 */
export const GLOBAL: Scope = "GLOBAL";
/**
 * "LOCALS"
 */
export const LOCALS: Scope = "LOCALS";
/**
 * "MYAREA"
 */
export const MYAREA: Scope = "MYAREA";
