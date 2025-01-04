/**
 * Type branding
 */
type Brand<B> = { __brand: B }
export type IE<T, B> = T & Brand<B>

/**
 * Object specifier, e.g. [ENEMY.0.0.MAGE].
 * 
 * No validation for now.
 */
export class ObjectSpec {
    id: string;
    constructor(id: string,) {
        this.id = id;
    }
}
/**
 * Object specifier, e.g. [ENEMY.0.0.MAGE].
 *
 * No validation for now.
 */
export function obj(spec: string) {
    return new ObjectSpec(spec);
}

/**
 * Game Object
 */
export declare type ObjectPtr = IE<string, 'ObjectPtr'> | ObjectSpec;

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
