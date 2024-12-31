/**
 * Type branding
 */
type Brand<B> = { __brand: B }
export type IE<T, B> = T & Brand<B>

/**
 * Game Object
 */
export declare type ObjectPtr = IE<number, 'ObjectPtr'>;

/**
 * Area point/location.
 */
export type Point = `[${number}.${number}]`;

/**
 * Action ID.
 */
export type Action = void;

export type SpellID = string & {};

/**
 * Resource reference, up to 8 characters.
 */
export type ResRef = IE<string, 'ResRef'>;

/**
 * Variable and timers scope.
 * "GLOBAL" | "LOCAL" | "MYAREA" | Area RESREF
 */
export type Scope = "GLOBAL" | "LOCALS" | "MYAREA" | ResRef;

export const GLOBAL: Scope = "GLOBAL";
export const LOCALS: Scope = "LOCALS";
export const MYAREA: Scope = "MYAREA";

/**
 * ITM ResRef
 */
export declare type ItmRef = IE<ResRef, 'ITM'>;
