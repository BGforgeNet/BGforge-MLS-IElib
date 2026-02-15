import type { AreRef, ItmRef, ObjectPtr, Scope, SplRef, SpellID } from "../index";

import type { Align } from "./align.ids";
import type { AreaTypeID as AreaType } from "./areatype.ids";
import type { AStyles } from "./astyles.ids";
import type { ClassID as Class } from "./class.ids";
import type { Damages } from "./damages.ids";
import type { DiffLev } from "./difflev.ids";
import type { EA } from "./ea.ids";
import type { GenderID as Gender } from "./gender.ids";
import type { GeneralID as General } from "./general.ids";
import type { Happy } from "./happy.ids";
import type { HotKeyID as HotKey } from "./hotkey.ids";
import type { KitID as Kit } from "./kit.ids";
import type { NPC } from "./npc.ids";
import type { Modal } from "./modal.ids";
import type { RaceID as Race } from "./race.ids";
import type { ReactionID as Reaction } from "./reaction.ids";
import type { ShoutID } from "./shoutids.ids";
import type { Slots } from "./slots.ids";
import type { Specific } from "./specific.ids";
import type { State } from "./state.ids";
import type { Stats } from "./stats.ids";
import type { TimeID as Time } from "./time.ids";
import type { TimeODay } from "./timeoday.ids";



/**
 * NT Returns true only if the current CRE obtained the specified item in the last script round. Trigger appears to be broken?
 */
declare function Acquired(item: ItmRef): boolean;

/**
 * Returns true only if the active CRE was attacked in the style specified (not necessarily hit) or had an offensive spell cast on it by the specified object in the last script round. The style parameter is non functional - this trigger is triggered by any attack style. Note that the LastAttacker object is only set for physical attacks (i.e. spell and script damage does not set LastAttacker).
 */
declare function AttackedBy(object: ObjectPtr, style: AStyles): boolean;

/**
 * Returns true if the specified object shouted for Help() in the two script rounds. Help() has a range of approximately 40.
 */
declare function Help(object: ObjectPtr): boolean;

/**
 * Returns true if the specified object has joined the party in the last script round. This trigger is only sent to player characters.
 */
declare function Joins(object: ObjectPtr): boolean;

/**
 * Returns true if the specified object has left the party in the last script round. This trigger is only sent to player characters.
 */
declare function Leaves(object: ObjectPtr): boolean;

/**
 * This trigger is used in conjunction with the GiveOrder() action, and works in a similar way to the Heard() trigger. Only one creature at a time responds to an order, and creatures do not detect their own orders. The creature must be in visual range for this trigger to work.
 */
declare function ReceivedOrder(object: ObjectPtr, orderID: number): boolean;

/**
 * NT
 */
declare function Said(object: ObjectPtr, dialogID: number): boolean;

/**
 * NT Returns true only if the active CRE was turned by the specified priest or paladin.
 */
declare function TurnedBy(object: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified item is unusable by the active CRE.
 */
declare function Unusable(item: ItmRef): boolean;

/**
 * Returns true only if the alignment of the specified object matches that in the second parameter.
 */
declare function Alignment(object: ObjectPtr, alignment: Align): boolean;

/**
 * Returns true only if the Enemy/Ally status of the specified object matches that in the second parameter.
 */
declare function Allegiance(object: ObjectPtr, allegiance: EA): boolean;

/**
 * Returns true only if the Class of the specified object matches that in the second parameter.
 */
declare function Class(object: ObjectPtr, classID: Class): boolean;

/**
 * Returns true only if the specified object exists in the current area (note that dead creatures can still be counted as existing).
 */
declare function Exists(object: ObjectPtr): boolean;

/**
 * Returns true only if the General category of the specified object matches that in the second parameter.
 */
declare function General(object: ObjectPtr, general: General): boolean;

/**
 * Returns true only if the variable with name 1st parameter of type 2nd parameter has value 3rd parameter.
 */
declare function Global(name: string, scope: Scope, value: number): boolean;

/**
 * Returns true only if the current hitpoints of the specified object are equal to the 2nd parameter.
 */
declare function HP(object: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the current hitpoints of the specified object are greater than the 2nd parameter.
 */
declare function HPGT(object: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the current hitpoints of the specified object are less than the 2nd parameter.
 */
declare function HPLT(object: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the object specified is in the line of sight of the active CRE and within the given range. This seems to be a combination of the Range and See triggers (see below). Range seems limited to the default visual range (30).
 */
declare function LOS(object: ObjectPtr, range: number): boolean;

/**
 * Returns true only if the morale of the specified object is equal to the second parameter.
 */
declare function Morale(object: ObjectPtr, morale: number): boolean;

/**
 * Returns true only if the morale of the specified object is greater than thesecond parameter.
 */
declare function MoraleGT(object: ObjectPtr, morale: number): boolean;

/**
 * Returns true only if the morale of the specified object is less than the second parameter.
 */
declare function MoraleLT(object: ObjectPtr, morale: number): boolean;

/**
 * Returns true only if the Race of the specified object is the same as that specified by the 2nd parameter.
 */
declare function Race(object: ObjectPtr, race: Race): boolean;

/**
 * Returns true only if the specified object is within distance given (in feet) of the active CRE. Range seems limited to the default visual range (30), and does not bypass objects. Range is affected by foot circle size (e.g. the minimum range for a huge foot circle creature (Dragon) is 8). Melee range is 4.
 */
declare function Range(object: ObjectPtr, range: number): boolean;

/**
 * Returns true only if the reputation of the specified object is equal to the second parameter.
 */
declare function Reputation(object: ObjectPtr, reputation: number): boolean;

/**
 * Returns true only if the reputation of the specified object is greater than the second parameter.
 */
declare function ReputationGT(object: ObjectPtr, reputation: number): boolean;

/**
 * Returns true only if the reputation of the specified object is greater than the second parameter.
 */
declare function ReputationLT(object: ObjectPtr, reputation: number): boolean;

/**
 * Returns true only if the active CRE can see the specified object which must not be hidden or invisible.
 */
declare function See(object: ObjectPtr): boolean;

/**
 * Returns true only if the specifics (as set in the CRE file or by the ChangeSpecifics action) of the specified object is equal to the 2nd parameter.
 */
declare function Specifics(object: ObjectPtr, specifics: Specific): boolean;

/**
 * Returns true only if the period of day matches the period in the 2nd parameter (taken from Time.ids). Hours are offset by 30 minutes, e.g. Time(1) is true between 00:30 and 01:29.
 */
declare function Time(time: Time): boolean;

/**
 * As above but less specific and uses TimeODay.ids at the following times: MORNING: at 6 hours, DAY: from 7 to 20 hours, DUSK: at 21 hours, NIGHT: from 22 hours to 5 hours.
 */
declare function TimeOfDay(timeOfDay: TimeODay): boolean;

/**
 * Returns true only if the active CRE was hit by the specifed object by the specified damage type in the last script round. If the damage type is CRUSHING or 0 then this will return true for ANY damage type. !HitBy returns true when the script is first activated (e.g. initial area load) and when hit by any damage type.
 */
declare function HitBy(object: ObjectPtr, dameType: Damages): boolean;

/**
 * Returns true only if the specified key was pressed in the last script round. Hotkeys defined in keymap.ini take precedence over hotkeys expected by this trigger.
 */
declare function HotKey(key: HotKey): boolean;

/**
 * Returns true only if the local timer with the specified ID has expired. This action does not work as a state or response trigger in dialogs.
 */
declare function TimerExpired(id: number): boolean;

/**
 * Always returns true.
 */
declare function True(): boolean;

/**
 * Used as a form of script communication, in conjunction with the SendTrigger() action. Seems to have the same range as GiveOrder, and affects only one creature at once. The LastTrigger object does not get set after receiving a trigger.
 */
declare function Trigger(triggerNum: number): boolean;

/**
 * Returns true if the active CRE has died in the last script round. NB. When a block returns true to this trigger, this will be the final block executed in the script, unless it is Continue'd
 */
declare function Die(): boolean;

/**
 * Returns true only if an action from the Attack, Spell or UseItem families that targeted the object specified cannot work with that target any more. That can happen from it not being in the area, deactivation, imprisonment, invisibility and sanctuary (provided true seeing options are not in play).
 */
declare function TargetUnreachable(object: ObjectPtr): boolean;

/**
 * Delays the next check of the block of triggers where this trigger is, by the number of seconds specified. This value is not stored when the game is saved.
 */
declare function Delay(delay: number): boolean;

/**
 * Returns true only if the number of creatures of the type specified in sight of the active CRE are equal to the 2nd parameter.
 */
declare function NumCreature(object: ObjectPtr, number: number): boolean;

/**
 * As above except for less than.
 */
declare function NumCreatureLT(object: ObjectPtr, number: number): boolean;

/**
 * As above except for greater than.
 */
declare function NumCreatureGT(object: ObjectPtr, number: number): boolean;

/**
 * Returns true only if the active CRE has no actions waiting to be performed, i.e. is idle.
 */
declare function ActionListEmpty(): boolean;

/**
 * See HP(O:Object*,I:Hit Points*) except this is for a percentage.
 */
declare function HPPercent(object: ObjectPtr, hitPoints: number): boolean;

/**
 * See HPLT(O:Object*,I:Hit Points*) except this is for a percentage.
 */
declare function HPPercentLT(object: ObjectPtr, hitPoints: number): boolean;

/**
 * See HPGT(O:Object*,I:Hit Points*) except this is for a percentage.
 */
declare function HPPercentGT(object: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the active CRE was within shouting range (see Shout/GlobalShout) of the specified object and the specified object shouted the specified number (which does not have to be in SHOUTIDS.IDS) in the last script round.
 */
declare function Heard(object: ObjectPtr, id: ShoutID): boolean;

/**
 * Never returns true, i.e. is always false. A block of triggers containing this will never return true regardless of the other triggers in the block. The corresponding actions will never take place.
 */
declare function False(): boolean;

/**
 * Returns true only if the active CRE has the specified spell memorised.
 */
declare function HaveSpell(spell: SpellID): boolean;

/**
 * Returns true if the active CRE has at least one spell memorised.
 */
declare function HaveAnySpells(): boolean;

/**
 * NT Returns true only if the active CRE turned visible in the last script round.
 */
declare function BecameVisible(): boolean;

/**
 * See Global(S:Name*,S:Scope*,I:Value*) except the variable must be greater than the value specified to be true.
 */
declare function GlobalGT(name: string, scope: Scope, value: number): boolean;

/**
 * As above except for less than.
 */
declare function GlobalLT(name: string, scope: Scope, value: number): boolean;

/**
 * Returns true if the script is processed for the first time this session, e.g. when a creature is created (for CRE scripts) or when the player enters an area (for ARE scripts).
 */
declare function OnCreation(): boolean;

/**
 * Returns true only if the specified object is in the state specified.
 */
declare function StateCheck(object: ObjectPtr, state: State): boolean;

/**
 * Exact opposite of above.
 */
declare function NotStateCheck(object: ObjectPtr, state: State): boolean;

/**
 * Returns true only if the player's party has spoken to the active CRE the exact number of times specified. NB. NumTimesTalkedTo seems to increment when a PCinitiates conversion with an NPC, or an NPC initiates conversation with a PC. NumTimesTalkedTo does not seem to increment for force-talks, interactions, interjections and self-talking.
 */
declare function NumTimesTalkedTo(num: number): boolean;

/**
 * Returns true only if the player's party has spoken to the active CRE more than the number of times specified.
 */
declare function NumTimesTalkedToGT(num: number): boolean;

/**
 * Returns true only if the player's party has spoken to the active CRE less than the number of times specified.
 */
declare function NumTimesTalkedToLT(num: number): boolean;

/**
 * Returns true only if the reaction of the object specified (on the friendly-hostile scale) to the player was as specified. NB. Reaction = 10 + rmodchr + rmodrep (see rmodchr.2da and rmodrep.2da).
 */
declare function Reaction(object: ObjectPtr, value: Reaction): boolean;

/**
 * Returns true if the reaction of the object specified (on the friendly-hostile scale) to the player was greater than specified. NB. Reaction = 10 + rmodchr + rmodrep (see rmodchr.2da and rmodrep.2da).
 */
declare function ReactionGT(object: ObjectPtr, value: Reaction): boolean;

/**
 * Returns true if the reaction of the object specified (on the friendly-hostile scale) to the player was lower than specified. NB. Reaction = 10 + rmodchr + rmodrep (see rmodchr.2da and rmodrep.2da).
 */
declare function ReactionLT(object: ObjectPtr, value: Reaction): boolean;

/**
 * NT
 */
declare function GlobalTimerExact(name: string, scope: Scope): boolean;

/**
 * Returns true only if the timer with the name specified and of the type in the 2nd parameter has run and expired.
 */
declare function GlobalTimerExpired(name: string, scope: Scope): boolean;

/**
 * Returns true only if the timer with the name specified and of the type in the 2nd parameter is still running. Note that if we use !GlobalTimerNotExpired(S:Name*,S:Scope*) this will return true if the timer has never been set OR if it has already expired- very useful...most useful of all the GlobalTimer triggers :) .
 */
declare function GlobalTimerNotExpired(name: string, scope: Scope): boolean;

/**
 * Returns true if any of the party members have the specified item in their inventory. This trigger also checks with container items (e.g. Bags of Holding).
 */
declare function PartyHasItem(item: ItmRef): boolean;

/**
 * Returns true only if the specifed object is in the player's party.
 */
declare function InParty(object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has the statistic in the 3rd parameter at the value of the 2nd parameter.
 */
declare function CheckStat(object: ObjectPtr, value: number, statNum: Stats): boolean;

/**
 * Returns true only if the specified object has the statistic in the 3rd parameter greater than the value of the 2nd parameter.
 */
declare function CheckStatGT(object: ObjectPtr, value: number, statNum: Stats): boolean;

/**
 * Returns true only if the specified object has the statistic in the 3rd parameter less than the value of the 2nd parameter.
 */
declare function CheckStatLT(object: ObjectPtr, value: number, statNum: Stats): boolean;

/**
 * Generates a random number between 1 and Range. Returns true only if the random number equals the 2nd parameter.
 */
declare function RandomNum(range: number, value: number): boolean;

/**
 * NT As above except returns true only if the random number is greater than the 2nd parameter.
 */
declare function RandomNumGT(range: number, value: number): boolean;

/**
 * NT As above except returns true only if the random number is less than the 2nd parameter.
 */
declare function RandomNumLT(range: number, value: number): boolean;

/**
 * Returns true only if the specifed object died in the last script round.
 */
declare function Died(object: ObjectPtr): boolean;

/**
 * NT Returns true if the active CRE killed the specified object in the last script round.
 */
declare function Killed(object: ObjectPtr): boolean;

/**
 * Only for trigger regions in areas. Returns true only if the specified object entered the trigger region in the last script round.
 */
declare function Entered(object: ObjectPtr): boolean;

/**
 * Returns true only if the gender of the specified object is that given in the 2nd parameter.
 */
declare function Gender(object: ObjectPtr, sex: Gender): boolean;

/**
 * Returns true only if the player's party has the amount of gold specified in the 2nd parameter.
 */
declare function PartyGold(amount: number): boolean;

/**
 * Returns true only if the player's party has more gold than specified in the 2nd parameter.
 */
declare function PartyGoldGT(amount: number): boolean;

/**
 * Returns true only if the player's party has less gold than specified in the 2nd parameter.
 */
declare function PartyGoldLT(amount: number): boolean;

/**
 * Returns only true if the creature with the specified script name has its death variable set to 1. Not every form of death sets this, but most do. So it's an almost complete test for death. The creature must have existed for this to be true. Note that SPRITE_IS_DEAD variables are not set if the creaure is killed by a neutral creature.
 */
declare function Dead(name: string): boolean;

/**
 * Only for door scripts. Returns true only if the specified object opened the active door in the last script round.
 */
declare function Opened(object: ObjectPtr): boolean;

/**
 * Only for door scripts. Returns true only if the specified object closed the active door in the last script round.
 */
declare function Closed(object: ObjectPtr): boolean;

/**
 * Only for trap scripts. Returns true only if the specified object detected this trap in the last script round.
 */
declare function Detected(object: ObjectPtr): boolean;

/**
 * Only for trap scripts? Returns true only if this trap or trigger was reset in the last script round by the object specified.
 */
declare function Reset(object: ObjectPtr): boolean;

/**
 * Only for trap/trigger region scripts. Returns true only if the specified object disarmed this trap in the last script round.
 */
declare function Disarmed(object: ObjectPtr): boolean;

/**
 * Only for door scripts - returns true only if this door was unlocked by the specified object in the last script round. Appears to be broken.
 */
declare function Unlocked(object: ObjectPtr): boolean;

/**
 * Seems to be broken. Returns true only if the active CRE has no ammunition for the current ranged weapon.
 */
declare function OutOfAmmo(): boolean;

/**
 * NT Returns true only if the specified NPC has interacted with the party a number of times equal to the 2nd parameter.
 */
declare function NumTimesInteracted(nPC: NPC, num: number): boolean;

/**
 * NT Returns true only if the specified NPC has interacted with the party a number of times greater than the 2nd parameter.
 */
declare function NumTimesInteractedGT(nPC: NPC, num: number): boolean;

/**
 * NT Returns true only if the specified NPC has interacted with the party a number of times less than the 2nd parameter.
 */
declare function NumTimesInteractedLT(nPC: NPC, num: number): boolean;

/**
 * Checks the current creatures happiness value. Note that this trigger is only evaluated when the happiness value is checked (at all other times this trigger returns false).
 */
declare function BreakingPoint(): boolean;

/**
 * Seems to be broken. Not used in any existing scripts.
 */
declare function PickPocketFailed(object: ObjectPtr): boolean;

/**
 * For shopkeepers. Returns true if the specified object failed to steal from the shop in the last script round.
 */
declare function StealFailed(object: ObjectPtr): boolean;

/**
 * NT Not used in any existing scripts.
 */
declare function DisarmFailed(object: ObjectPtr): boolean;

/**
 * NT Not used in any existing scripts.
 */
declare function PickLockFailed(object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has the specified item in its inventory. This trigger also checks with container items (e.g. Bags of Holding).
 */
declare function HasItem(item: ItmRef, object: ObjectPtr): boolean;

/**
 * NT Returns true only if the active CRE is interacting (dialogue?) with the specified object.
 */
declare function InteractingWith(object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object is within the range of the active CRE's currently equipped weapon.
 */
declare function InWeaponRange(object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has a weapon in a quickslot.
 */
declare function HasWeaponEquiped(object: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object has the specified happiness value.
 */
declare function Happiness(object: ObjectPtr, amount: Happy): boolean;

/**
 * NT Returns true only if the specified object has greater than the specified happiness value.
 */
declare function HappinessGT(object: ObjectPtr, amount: Happy): boolean;

/**
 * NT Returns true only if the specified object has less than the specified happiness value.
 */
declare function HappinessLT(object: ObjectPtr, amount: Happy): boolean;

/**
 * Returns true only if the current time is greater than that specified. Hours are offset by 30 minutes, e.g. TimeGT(1) is true between 01:30 and 02:29.
 */
declare function TimeGT(time: Time): boolean;

/**
 * Returns true only if the current time is less than that specified. Hours are offset by 30 minutes, e.g. TimeLT(1) is true between 23:30 and 00:29.
 */
declare function TimeLT(time: Time): boolean;

/**
 * Returns true only if the number of party members (dead ones also count) is equal to the number specified.
 */
declare function NumInParty(num: number): boolean;

/**
 * Returns true only if the number of party members (dead ones also count) is greater than the number specified.
 */
declare function NumInPartyGT(num: number): boolean;

/**
 * Returns true only if the number of party members (dead ones also count) is less than the number specified.
 */
declare function NumInPartyLT(num: number): boolean;

/**
 * Returns true only if the active creature is for exactly the specified number of ticks (1/15th seconds) left under the effect of the script action MakeUnselectable().
 */
declare function UnselectableVariable(num: number): boolean;

/**
 * Returns true only if the active creature is for more than the specified number of ticks (1/15th seconds) left under the effect of the script action MakeUnselectable().
 */
declare function UnselectableVariableGT(num: number): boolean;

/**
 * Returns true only if the active creature is for less than the specified number of ticks (1/15th seconds) left under the effect of the script action MakeUnselectable().
 */
declare function UnselectableVariableLT(num: number): boolean;

/**
 * Only for trigger regions. Returns true if the specified object clicked on the trigger region running this script.
 */
declare function Clicked(object: ObjectPtr): boolean;

/**
 * Returns true only if the number of times the party has spoken to this creature is equal to the number specified.
 */
declare function NumberOfTimesTalkedTo(num: number): boolean;

/**
 * Returns true only if the number of creatures with script name "Name" that have been killed is equal to the 2nd parameter.
 */
declare function NumDead(name: string, num: number): boolean;

/**
 * Returns true only if the number of creatures with script name "Name" that have been killed is greater than the 2nd parameter.
 */
declare function NumDeadGT(name: string, num: number): boolean;

/**
 * Returns true only if the number of creatures with script name "Name" that have been killed is less than the 2nd parameter.
 */
declare function NumDeadLT(name: string, num: number): boolean;

/**
 * Returns true if the the specified object is detected by the active CRE in any way (hearing or sight). Neither Move Silently and Hide in Shadows prevent creatures being detected via Detect(). Detect ignores Protection from Creature type effects for static objects.
 */
declare function Detect(object: ObjectPtr): boolean;

/**
 * Returns true only if the item specified in parameter 1 is in the container specified in parameter 2.
 */
declare function Contains(item: ItmRef, object: ObjectPtr): boolean;

/**
 * NT Returns true only if the open state of the specified door matches the state specified in the 2nd parameter.
 */
declare function OpenState(object: ObjectPtr, open: boolean): boolean;

/**
 * Returns true only if the specified object has the number of items in the 3rd parameter of the type specified in the 1st parameter in its inventory.
 */
declare function NumItems(item: ItmRef, object: ObjectPtr, num: number): boolean;

/**
 * Returns true only if the specified object has more than the number of items in the 3rd parameter of the type specified in the 1st parameter in its inventory.
 */
declare function NumItemsGT(item: ItmRef, object: ObjectPtr, num: number): boolean;

/**
 * Returns true only if the specified object has fewer than the number of items in the 3rd parameter of the type specified in the 1st parameter in its inventory.
 */
declare function NumItemsLT(item: ItmRef, object: ObjectPtr, num: number): boolean;

/**
 * Returns true only if the party has a total number of items of the type specified equal to the 2nd parameter.
 */
declare function NumItemsParty(item: ItmRef, num: number): boolean;

/**
 * Returns true only if the party has a total number of items of the type specified greater than the 2nd parameter.
 */
declare function NumItemsPartyGT(item: ItmRef, num: number): boolean;

/**
 * Returns true only if the party has a total number of items of the type specified less than the 2nd parameter.
 */
declare function NumItemsPartyLT(item: ItmRef, num: number): boolean;

/**
 * Only for trigger regions. Returns true only if the specified object is over the trigger running the script.
 */
declare function IsOverMe(object: ObjectPtr): boolean;

/**
 * Returns true only if the active CRE is in the area specified.
 */
declare function AreaCheck(area: AreRef): boolean;

/**
 * Returns true if the specified object has the specified item outside the general inventory slots (does not check for equipped status). This trigger does not work for Melf's Minute Meteors or other magically created weapons.
 */
declare function HasItemEquiped(item: ItmRef, object: ObjectPtr): boolean;

/**
 * Returns true if the number of hostile creatures of the type specified in the 1st parameter that are currently in fighting range of the party, minus the number of party members, is equal to the 2nd parameter.
 */
declare function NumCreatureVsParty(object: ObjectPtr, number: number): boolean;

/**
 * Returns true if the number of hostile creatures of the type specified in the 1st parameter that are currently in fighting range of the party, minus the number of party members, is less than the 2nd parameter.
 */
declare function NumCreatureVsPartyLT(object: ObjectPtr, number: number): boolean;

/**
 * Returns true if the number of hostile creatures of the type specified in the 1st parameter that are currently in fighting range of the party, minus the number of party members, is greater than the 2nd parameter.
 */
declare function NumCreatureVsPartyGT(object: ObjectPtr, number: number): boolean;

/**
 * This trigger does may not work as expected. Returns true only if the combat counter (counts down from 150 after each attack) is of the value specified. CombatCounter(0) returns true only if there is no combat in the active area at the moment. CombatCounter can give false results after dialog has been completed or after a Hide in Shadows chck has been failed.
 */
declare function CombatCounter(number: number): boolean;

/**
 * Returns true only if the combat counter (counts down from 150 after each attack) is less than the value specified.
 */
declare function CombatCounterLT(number: number): boolean;

/**
 * This trigger does not work as expected. Returns true only if the combat counter (counts down from 150 after each attack) is greater than the value specified. CombatCounterGT(0) returns true if there is any combat going on in the active area.
 */
declare function CombatCounterGT(number: number): boolean;

/**
 * Returns true only if the area in which the active CRE is, has the specified type flag set. Note that the value is OR'd. This trigger can cause a crash if it evaluates to true and is used as the first trigger in a dead NPCs dream script.
 */
declare function AreaType(number: AreaType): boolean;

/**
 * NT Only for trigger regions/traps. Returns true if this trap was triggered by the object specified.
 */
declare function TrapTriggered(triggerer: ObjectPtr): boolean;

/**
 * NT Returns true only if the party member specified died in the last script round.
 */
declare function PartyMemberDied(object: ObjectPtr): boolean;

/**
 * Returns true if any of the next 'OrCount' triggers returns true.
 */
declare function OR(orCount: number): boolean;

/**
 * Returns true only if the specified object is in the party and in the slot specified (slots are 0-5). Party slots are based on join order; Player1 is in slot 0, Player2 in slot 1 etc.
 */
declare function InPartySlot(object: ObjectPtr, slot: number): boolean;

/**
 * Returns true only if the specified object cast the spell in the 2nd paramater in the last script round.
 */
declare function SpellCast(object: ObjectPtr, spell: SpellID): boolean;

/**
 * InLine(S:Target*,O:Object*) seems to have no effect. InLine(O:Object*) returns true if the active creature can see the target creature.
 */
declare function InLine(target: string, object: ObjectPtr): boolean;

/**
 * Returns true if the party has just finished resting.
 */
declare function PartyRested(): boolean;

/**
 * Returns true only if the experience level of the specified object equals the 2nd parameter.
 */
declare function Level(object: ObjectPtr, level: number): boolean;

/**
 * Returns true only if the experience level of the specified object is greater than the 2nd parameter.
 */
declare function LevelGT(object: ObjectPtr, level: number): boolean;

/**
 * Returns true only if the experience level of the specified object is less than the 2nd parameter.
 */
declare function LevelLT(object: ObjectPtr, level: number): boolean;

/**
 * NT Returns true only if the active CRE summoned the specified object in the last script round.
 */
declare function Summoned(object: ObjectPtr): boolean;

/**
 * Returns true only if the 2 global variables specified have equal values.
 */
declare function GlobalsEqual(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st global variable has a value greater than the 2nd one.
 */
declare function GlobalsGT(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st global variable has a value less than the 2nd one.
 */
declare function GlobalsLT(name1: string, name2: string): boolean;

/**
 * Returns true only if the 2 local variables specified have equal values.
 */
declare function LocalsEqual(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st local variable has a value less than the 2nd one.
 */
declare function LocalsGT(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st local variable has a value less than the 2nd one.
 */
declare function LocalsLT(name1: string, name2: string): boolean;

/**
 * Returns true only if the specified object has no actions waiting to be performed.
 */
declare function ObjectActionListEmpty(object: ObjectPtr): boolean;

/**
 * Returns true if the specified object is on the screen.
 */
declare function OnScreen(object: ObjectPtr): boolean;

/**
 * Returns true only if specified object is in the active area. The active area is that in which player 1 is. This trigger will crash the game if the specified creature is not in the active area and is not a global object.
 */
declare function InActiveArea(object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object cast the specified spell on the active CRE in the last scriptround. Returns false for spells whose Ability target (offset 0xC) is 4 (Any point within range).
 */
declare function SpellCastOnMe(caster: ObjectPtr, spell: SpellID): boolean;

/**
 * NT Returns true only if the current day is the day specified.
 */
declare function CalanderDay(day: number): boolean;

/**
 * NT Returns true only if the current day is after the day specified.
 */
declare function CalanderDayGT(day: number): boolean;

/**
 * NT Returns true only if the current day is before the day specified.
 */
declare function CalanderDayLT(day: number): boolean;

/**
 * Returns true only if the object in the 2nd parameter has the scriptname specified.
 */
declare function Name(name: string, object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object cast the specified priest spell in the last script round.
 */
declare function SpellCastPriest(object: ObjectPtr, spell: SpellID): boolean;

/**
 * Returns true only if the specified object cast the specified innate spell in the last script round. NB. The spell level must match the spells definition (in spell.ids) for the trigger to return true.
 */
declare function SpellCastInnate(object: ObjectPtr, spell: SpellID): boolean;

/**
 * 
 */
declare function IsValidForPartyDialog(object: ObjectPtr): boolean;

/**
 * 
 */
declare function IfValidForPartyDialog(object: ObjectPtr): boolean;

/**
 * 
 */
declare function IsValidForPartyDialogue(object: ObjectPtr): boolean;

/**
 * Returns true only if that specifed party member can take part in party dialogue.
 */
declare function IfValidForPartyDialogue(object: ObjectPtr): boolean;

/**
 * Returns true only if the party has the item specified and it is identified.
 */
declare function PartyHasItemIdentified(item: ItmRef): boolean;

/**
 * Returns true if any of the specified object is currently affected by any of the listed effects:  0xc5 Bounce Projectile 0xc6 Bounce Opcode 0xc7 Bounce Spell Level 0xc8 0xca Bounce Spell School 0xcb Bounce Secondary Type 0xcf Bounce Specified School 0xe3 Bounce School Decrement 0xe4 Bounce Secondary Type Decrement
 */
declare function HasBounceEffects(object: ObjectPtr): boolean;

/**
 * Returns true if any of the specified object is currently affected by any of the listed effects:  0x53 Protection from projectiles 0x65 Protection from effects 0xa9 Protection from portrait icon (this is a subtype of 0x65) 0x10b Protection from display string (also a subtype of 0x65) 0x128 Protection from visual effect (also a subtype of 0x65) 0x66 Immunity to spell level 0xc9 Decrementing spell level immunity 0xcc Immunity to primary type (school) 0xcd Immunity to secondary type 0xdf Decrementing immunity to primary type 0xe2 Decrementing immunity to secondary type
 */
declare function HasImmunityEffects(object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has an item in the specified slot. This trigger does not work for Melf's Minute Meteors.
 */
declare function HasItemSlot(object: ObjectPtr, slot: Slots): boolean;

/**
 * NT Returns true if the specified object exactly as far away from the active CRE as the 2nd parameter specifies.
 */
declare function PersonalSpaceDistance(object: ObjectPtr, range: number): boolean;

/**
 * Returns true only if the specifics value of the specified object is the same as that of the active CRE.
 */
declare function InMyGroup(object: ObjectPtr): boolean;

/**
 * NT
 */
declare function RealGlobalTimerExact(name: string, scope: Scope): boolean;

/**
 * NT Returns true only if the timer with the specified name of the specified area has been set at least once and has now expired.
 */
declare function RealGlobalTimerExpired(name: string, scope: Scope): boolean;

/**
 * NT Returns true only if the timer with the specified name of the specified area has been set and has not yet expired.
 */
declare function RealGlobalTimerNotExpired(name: string, scope: Scope): boolean;

/**
 * Returns true only if the number of party members alive is equal to the number specified.
 */
declare function NumInPartyAlive(num: number): boolean;

/**
 * Returns true only if the number of party members alive is greater than the number specified.
 */
declare function NumInPartyAliveGT(num: number): boolean;

/**
 * Returns true only if the number of party members alive is less than the number specified.
 */
declare function NumInPartyAliveLT(num: number): boolean;

/**
 * NT Returns true only if the specified object is of the kit specified. NB. A creature's assigned kit is stored as a dword, however the Kit() trigger only checks the upper word. This, in conjunction with various incorrect values in the game cre files, and an incorrect kits.ids file, means the Kit() trigger can often fail. For optimal usage, the default kit.ids file should be replaced with the updated one listed in the BG2: ToB ids page.
 */
declare function Kit(object: ObjectPtr, kit: Kit): boolean;

/**
 * Returns true only if the specified object is the current speaker (in a dialog).
 */
declare function IsGabber(object: ObjectPtr): boolean;

/**
 * Returns true if the specified creature is active and false if it is deactivated. A creature will continue to execute script blocks even while deactivated - this trigger can be used to restrict this behaviour.
 */
declare function IsActive(object: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object has the character name specified.
 */
declare function CharName(name: string, object: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object is a fallen ranger.
 */
declare function FallenRanger(object: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object is a fallen ranger.
 */
declare function FallenPaladin(object: ObjectPtr): boolean;

/**
 * Returns true only if the specified object can carry no more items.
 */
declare function InventoryFull(object: ObjectPtr): boolean;

/**
 * Returns true if the specified object has the specified item outside the general inventory slots. Unlike HasItemEquiped it only checks the equipped weapon slot, not all of them. This trigger does not work for Melf's Minute Meteors or other magically created weapons.
 */
declare function HasItemEquipedReal(item: ItmRef, object: ObjectPtr): boolean;

/**
 * Returns true if the specified object has experience points equal to the number specified.
 */
declare function XP(object: ObjectPtr, xP: number): boolean;

/**
 * Returns true if the specified object has experience points greater than the number specified.
 */
declare function XPGT(object: ObjectPtr, xP: number): boolean;

/**
 * Returns true if the specified object has experience points less than the number specified.
 */
declare function XPLT(object: ObjectPtr, xP: number): boolean;

/**
 * This trigger acts as a shortcut for Global(). The trigger can only check global variables.
 */
declare function G(resRef: string, num: number): boolean;

/**
 * This trigger acts as a shortcut for GlobalGT(). The trigger can only check global variables.
 */
declare function GGT(resRef: string, num: number): boolean;

/**
 * This trigger acts as a shortcut for GlobalLT(). The trigger can only check global variables.
 */
declare function GLT(resRef: string, num: number): boolean;

/**
 * Returns true only if the active CRE is in the state/mode specified. e.g. detecting traps.
 */
declare function ModalState(state: Modal): boolean;

/**
 * Returns true only if the specified object is in the same area as the active CRE.
 */
declare function InMyArea(object: ObjectPtr): boolean;

/**
 * Returns true if some type of damage was caused to the active CRE (and HP were lost) in the last script round.
 */
declare function TookDamage(): boolean;

/**
 * Returns true if the total damage taken by the active CRE is of the amount specified. Think of this as the reverse of testing for HP. See HP.
 */
declare function DamageTaken(amount: number): boolean;

/**
 * See above and HPGT. Note: This trigger may not act correctly until the active creature has dropped below their maximum base HP (i.e. without CON bonus taken into account).
 */
declare function DamageTakenGT(amount: number): boolean;

/**
 * See above and HPLT.
 */
declare function DamageTakenLT(amount: number): boolean;

/**
 * NT Returns true only if the game difficulty setting is of the level specified.
 */
declare function Difficulty(amount: DiffLev): boolean;

/**
 * NT Returns true only if the game difficulty setting is greater than the level specified.
 */
declare function DifficultyGT(amount: DiffLev): boolean;

/**
 * NT Returns true only if the game difficulty setting is less than the level specified.
 */
declare function DifficultyLT(amount: DiffLev): boolean;

/**
 * NT Returns true if the specified object which can be dead or alive is in the party.
 */
declare function InPartyAllowDead(object: ObjectPtr): boolean;

/**
 * Returns true if the specified object is in the area specified. This trigger can cause a crash if the specified area is not loaded.
 */
declare function AreaCheckObject(area: AreRef, object: ObjectPtr): boolean;

/**
 * Returns true if combat counter is greater than 0. Confirmed as working in SoA.
 */
declare function ActuallyInCombat(): boolean;

/**
 * NT Only for trigger regions. Returns true if the specified object has walked to this trigger.
 */
declare function WalkedToTrigger(object: ObjectPtr): boolean;

/**
 * Returns true only if the average level of the party is equal to the number specified. Only the highest level of dual/multi-class characters is taken into account.
 */
declare function LevelParty(num: number): boolean;

/**
 * Returns true only if the average level of the party is greater than the number specified. Only the highest level of dual/multi-class characters is taken into account.
 */
declare function LevelPartyGT(num: number): boolean;

/**
 * Returns true only if the average level of the party is less than the number specified. Only the highest level of dual/multi-class characters is taken into account.
 */
declare function LevelPartyLT(num: number): boolean;

/**
 * Returns true if any of the party members have the specified spell memorised.
 */
declare function HaveSpellParty(spell: SpellID): boolean;

/**
 * ToB only. Returns true if the active CRE has the specified (by the string parameter) spell memorised.
 */
declare function HaveSpellRES(spell: SplRef): boolean;

/**
 * ToB only. Returns true only if the active CRE is in a Watcher's Keep (i.e. the current area begins with AR30).
 */
declare function AmIInWatchersKeepPleaseIgnoreTheLackOfApostophe(): boolean;

/**
 * ToB only. Returns true only if the active CRE is in a Watcher's Keep (i.e. the current area begins with AR30).
 */
declare function InWatchersKeep(): boolean;