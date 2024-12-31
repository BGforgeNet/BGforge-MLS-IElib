import type { ObjectPtr } from "../index";

/**
 * Self object
 */
declare const Myself: ObjectPtr;
// declare const dummyPtr: ObjectPtr;
/**
 * Returns the nearest enemy object
 * @param who target
 */
declare function NearestEnemyOf(who: ObjectPtr): ObjectPtr;

// export function NearestEnemyOf(who: ObjectPtr = Myself): ObjectPtr {
//     return dummyPtr;
// }
/**
 * Returns last object caught by See() action
 * @param who target
 */
declare function LastSeenBy(who: ObjectPtr): ObjectPtr;

/**
 * Player character
 */
declare const Player1: ObjectPtr;

declare const NEUTRAL: ObjectPtr;
