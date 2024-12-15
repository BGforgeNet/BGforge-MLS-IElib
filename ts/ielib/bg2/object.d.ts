import type { ObjectPtr } from "../index";

declare function Myself(): ObjectPtr;
declare function NearestEnemyOf(who: ObjectPtr): ObjectPtr;
declare function LastSeenBy(who: ObjectPtr): ObjectPtr;

declare const Player1: ObjectPtr;
