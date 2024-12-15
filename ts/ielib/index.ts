/**
 * Game Object
 */
export interface ObjectPtr {}

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
export type Resref = string & {};

/**
 * Variable and timers scope.
 * "GLOBAL" | "LOCAL" | "MYAREA" | Area RESREF
 */
export type Scope = "GLOBAL" | "LOCALS" | "MYAREA" | Resref;

export const GLOBAL: Scope = "GLOBAL";
export const LOCALS: Scope = "LOCALS";
export const MYAREA: Scope = "MYAREA";


/**
 * Type branding
 */
type Brand<B> = { __brand: B }
export type Branded<T, B> = T & Brand<B>
