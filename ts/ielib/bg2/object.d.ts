import type { ObjectPtr, ObjectSpec } from "../index";

/**
 * Nothing
 */
export declare const Nothing: ObjectPtr;

/**
 * Self object.
 */
export declare const Myself: ObjectPtr;

/**
 * Leader of the group.
 */
export declare function LeaderOf(target?: ObjectPtr): ObjectPtr;

/**
 * Not implemented.
 */
export declare function GroupOf(target?: ObjectPtr): ObjectPtr;

/**
 * The weakest player character (in the party).
 */
export declare function WeakestOf(target?: ObjectPtr): ObjectPtr;

/**
 * The strongest player character (in the party).
 */
export declare function StrongestOf(target?: ObjectPtr): ObjectPtr;

/**
 * The most damaged player character (in the party).
 */
export declare function MostDamagedOf(target?: ObjectPtr): ObjectPtr;

/**
 * The least damaged player character (in the party).
 */
export declare function LeastDamagedOf(target?: ObjectPtr): ObjectPtr;

/**
 * Protected by.
 */
export declare function ProtectedBy(target?: ObjectPtr): ObjectPtr;

/**
 * Protector of.
 */
export declare function ProtectorOf(target?: ObjectPtr): ObjectPtr;

/**
 * The creature that last inflicted physical damage on the active creature.
 */
export declare function LastAttackerOf(target?: ObjectPtr): ObjectPtr;

/**
 * May not be implemented.
 */
export declare function LastTargetedBy(target?: ObjectPtr): ObjectPtr;

/**
 * Last commanded by.
 */
export declare function LastCommandedBy(target?: ObjectPtr): ObjectPtr;

/**
 * The nearest visible creature.
 */
export declare const Nearest: ObjectPtr;

/**
 * Last hitter.
 */
export declare const LastHitter: ObjectPtr;

/**
 * Last help.
 */
export declare const LastHelp: ObjectPtr;

/**
 * Last trigger.
 */
export declare const LastTrigger: ObjectPtr;

/**
 * Player 1.
 */
export declare const Player1: ObjectPtr;

/**
 * Player 2.
 */
export declare const Player2: ObjectPtr;

/**
 * Player 3.
 */
export declare const Player3: ObjectPtr;

/**
 * Player 4.
 */
export declare const Player4: ObjectPtr;

/**
 * Player 5.
 */
export declare const Player5: ObjectPtr;

/**
 * Player 6.
 */
export declare const Player6: ObjectPtr;

/**
 * Protagonist.
 */
export declare const Protagonist: ObjectPtr;

/**
 * The strongest male player character (in the party).
 */
export declare function StrongestOfMale(target?: ObjectPtr): ObjectPtr;

/**
 * The second nearest visible creature.
 */
export declare const SecondNearest: ObjectPtr;

/**
 * The third nearest visible creature.
 */
export declare const ThirdNearest: ObjectPtr;

/**
 * The fourth nearest visible creature.
 */
export declare const FourthNearest: ObjectPtr;

/**
 * The fifth nearest visible creature.
 */
export declare const FifthNearest: ObjectPtr;

/**
 * The sixth nearest visible creature.
 */
export declare const SixthNearest: ObjectPtr;

/**
 * The seventh nearest visible creature.
 */
export declare const SeventhNearest: ObjectPtr;

/**
 * The eighth nearest visible creature.
 */
export declare const EighthNearest: ObjectPtr;

/**
 * The ninth nearest visible creature.
 */
export declare const NinthNearest: ObjectPtr;

/**
 * The tenth nearest visible creature.
 */
export declare const TenthNearest: ObjectPtr;

/**
 * The player character (in the party) with the highest AC.
 */
export declare const WorstAC: ObjectPtr;

/**
 * The player character (in the party) with the lowest AC.
 */
export declare const BestAC: ObjectPtr;

/**
 * Last summoner of.
 */
export declare function LastSummonerOf(target?: ObjectPtr): ObjectPtr;

/**
 * Nearest enemy of a specific type.
 */
export declare function NearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Second nearest enemy of a specific type.
 */
export declare function SecondNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Third nearest enemy of a specific type.
 */
export declare function ThirdNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Fourth nearest enemy of a specific type.
 */
export declare function FourthNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Fifth nearest enemy of a specific type.
 */
export declare function FifthNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Sixth nearest enemy of a specific type.
 */
export declare function SixthNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Seventh nearest enemy of a specific type.
 */
export declare function SeventhNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Eighth nearest enemy of a specific type.
 */
export declare function EigthNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Ninth nearest enemy of a specific type.
 */
export declare function NinthNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Tenth nearest enemy of a specific type.
 */
export declare function TenthNearestEnemyOfType(enemyType: ObjectSpec): ObjectPtr;

/**
 * Nearest group member of a specific type.
 */
export declare function NearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Second nearest group member of a specific type.
 */
export declare function SecondNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Third nearest group member of a specific type.
 */
export declare function ThirdNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Fourth nearest group member of a specific type.
 */
export declare function FourthNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Fifth nearest group member of a specific type.
 */
export declare function FifthNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Sixth nearest group member of a specific type.
 */
export declare function SixthNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Seventh nearest group member of a specific type.
 */
export declare function SeventhNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Eighth nearest group member of a specific type.
 */
export declare function EigthNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Ninth nearest group member of a specific type.
 */
export declare function NinthNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Tenth nearest group member of a specific type.
 */
export declare function TenthNearestMyGroupOfType(groupMemberType: ObjectSpec): ObjectPtr;

/**
 * Player in the first portrait slot.
 */
export declare const Player1Fill: ObjectPtr;

/**
 * Player in the second portrait slot.
 */
export declare const Player2Fill: ObjectPtr;

/**
 * Player in the third portrait slot.
 */
export declare const Player3Fill: ObjectPtr;

/**
 * Player in the fourth portrait slot.
 */
export declare const Player4Fill: ObjectPtr;

/**
 * Player in the fifth portrait slot.
 */
export declare const Player5Fill: ObjectPtr;

/**
 * Player in the sixth portrait slot.
 */
export declare const Player6Fill: ObjectPtr;

/**
 * The nearest closed door.
 */
export declare const NearestDoor: ObjectPtr;

/**
 * The second nearest closed door.
 */
export declare const SecondNearestDoor: ObjectPtr;

/**
 * The third nearest closed door.
 */
export declare const ThirdNearestDoor: ObjectPtr;

/**
 * The fourth nearest closed door.
 */
export declare const FourthNearestDoor: ObjectPtr;

/**
 * The fifth nearest closed door.
 */
export declare const FifthNearestDoor: ObjectPtr;

/**
 * The sixth nearest closed door.
 */
export declare const SixthNearestDoor: ObjectPtr;

/**
 * The seventh nearest closed door.
 */
export declare const SeventhNearestDoor: ObjectPtr;

/**
 * The eighth nearest closed door.
 */
export declare const EighthNearestDoor: ObjectPtr;

/**
 * The ninth nearest closed door.
 */
export declare const NinthNearestDoor: ObjectPtr;

/**
 * The tenth nearest closed door.
 */
export declare const TenthNearestDoor: ObjectPtr;
