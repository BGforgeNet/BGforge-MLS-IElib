import { ObjectPtr } from "..";


declare const Myself: ObjectPtr; // dupe to avoid circular import
// To keep declarations shorter
function DefaultSelf(who: ObjectPtr = Myself): ObjectPtr { return who };

/**
 * The nearest enemy of the target creature.
 */
export const NearestEnemyOf = DefaultSelf;

/**
 * Set by See() and Detect(), not by Exists() or Range().
 */
export const LastSeenBy = DefaultSelf;

/**
 * Last talked to by.
 */
export const LastTalkedToBy = DefaultSelf;

/**
 * Last heard by.
 */
export const LastHeardBy = DefaultSelf;

/**
 * The second nearest enemy of the target creature.
 */
export const SecondNearestEnemyOf = DefaultSelf;

/**
 * The third nearest enemy of the target creature.
 */
export const ThirdNearestEnemyOf = DefaultSelf;

/**
 * The fourth nearest enemy of the target creature.
 */
export const FourthNearestEnemyOf = DefaultSelf;

/**
 * The fifth nearest enemy of the target creature.
 */
export const FifthNearestEnemyOf = DefaultSelf;

/**
 * The sixth nearest enemy of the target creature.
 */
export const SixthNearestEnemyOf = DefaultSelf;

/**
 * The seventh nearest enemy of the target creature.
 */
export const SeventhNearestEnemyOf = DefaultSelf;

/**
 * The eighth nearest enemy of the target creature.
 */
export const EigthNearestEnemyOf = DefaultSelf;

/**
 * The ninth nearest enemy of the target creature.
 */
export const NinthNearestEnemyOf = DefaultSelf;

/**
 * The tenth nearest enemy of the target creature.
 */
export const TenthNearestEnemyOf = DefaultSelf;
