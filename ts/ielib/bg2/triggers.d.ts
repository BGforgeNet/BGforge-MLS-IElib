import type { ObjectPtr, Resref } from "../index";
import { AStyles } from "./astyles.ids";
import { Align } from "./align.ids";
import { EA } from "./ea.ids";
import { General } from "./general.ids";
import { Specific } from "./specific.ids";
import { Time } from "./time.ids";
import { TimeODay } from "./timeoday.ids";
import { SHOUTIDS } from "./shoutids.ids";
import { DIFFLEV } from "./difflev.ids";
import { Happy } from "./happy.ids";
import { Damages } from "./damages.ids";
import { HotKey } from "./hotkey.ids";
import { SpellID } from "..";
import { AreaType } from "./areatype.ids";
import { NPC } from "./npc.ids";
import { Stats } from "./stats.ids";
import { SLOTS } from "./slots.ids";
import { KIT } from "./kit.ids";
import { MODAL } from "./modal.ids";
import { State } from "./state.ids";
import { Gender } from "./gender.ids";
import { Reaction } from "./reaction.ids";
import { Race } from "./race.ids";
import { Class } from "./class.ids";


/**
 * NT Returns true only if the current CRE obtained the specified item in the last script round. Trigger appears to be broken.
 * @param resource Resref
*/
declare function Acquired(resource: Resref): boolean;

/**
 * Returns true only if the active CRE was attacked in the style specified (not necessarily hit) or had an offensive spell cast on it by the specified object in the last script round. The style parameter is non functional - this trigger is triggered by any attack style. Note that the LastAttacker object is only set for physical attacks (i.e. spell and script damage does not set LastAttacker).
 * @param who ObjectPtr
 * @param style AStyles
*/
declare function AttackedBy(who: ObjectPtr, style: AStyles): boolean;

/**
 * Returns true if the specified object has joined the party in the last script round. This trigger is only sent to player characters.
 * @param who ObjectPtr
*/
declare function Joins(who: ObjectPtr): boolean;

/**
 * Returns true if the specified object has left the party in the last script round. This trigger is only sent to player characters.
 * @param who ObjectPtr
*/
declare function Leaves(who: ObjectPtr): boolean;

/**
 * This trigger is used in conjunction with the GiveOrder() action, and works in a similar way to the Heard() trigger. Only one creature at a time responds to an order, and creatures do not detect their own orders. The creature must be in visual range for this trigger to work.
 * @param who ObjectPtr
 * @param orderID number
*/
declare function ReceivedOrder(who: ObjectPtr, orderID: number): boolean;

/**
 * NT
 * @param who ObjectPtr
 * @param dialogID number
*/
declare function Said(who: ObjectPtr, dialogID: number): boolean;

/**
 * NT Returns true only if the active CRE was turned by the specified priest or paladin.
 * @param who ObjectPtr
*/
declare function TurnedBy(who: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified item is unusable by the active CRE.
 * @param resource Resref
*/
declare function Unusable(resource: Resref): boolean;

/**
 * Returns true only if the alignment of the specified object matches that in the second parameter.
 * @param who ObjectPtr
 * @param alignment Align
*/
declare function Alignment(who: ObjectPtr, alignment: Align): boolean;

/**
 * Returns true only if the Enemy/Ally status of the specified object matches that in the second parameter.
 * @param who ObjectPtr
 * @param allegience EA
*/
declare function Allegiance(who: ObjectPtr, allegience: EA): boolean;

/**
 * Returns true only if the Class of the specified object matches that in the second parameter.
 * @param who ObjectPtr
 * @param classID Class
*/
declare function Class(who: ObjectPtr, classID: Class): boolean;

/**
 * Returns true only if the specified object exists in the current area (note that dead creatures can still be counted as existing).
 * @param who ObjectPtr
*/
declare function Exists(who: ObjectPtr): boolean;

/**
 * Returns true only if the General category of the specified object matches that in the second parameter.
 * @param who ObjectPtr
 * @param general General
*/
declare function General(who: ObjectPtr, general: General): boolean;

/**
 * Returns true only if the variable with name 1st parameter of type 2nd parameter has value 3rd parameter.
 * @param name string
 * @param area string
 * @param value number
*/
declare function Global(name: string, area: string, value: number): boolean;

/**
 * Returns true only if the current hitpoints of the specified object are equal to the 2nd parameter.
 * @param who ObjectPtr
 * @param hitPoints number
*/
declare function HP(who: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the current hitpoints of the specified object are greater than the 2nd parameter.
 * @param who ObjectPtr
 * @param hitPoints number
*/
declare function HPGT(who: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the current hitpoints of the specified object are less than the 2nd parameter.
 * @param who ObjectPtr
 * @param hitPoints number
*/
declare function HPLT(who: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the object specified is in the line of sight of the active CRE and within the given range. This seems to be a combination of the Range and See triggers (see below). Range seems limited to the default visual range (30).
 * @param who ObjectPtr
 * @param range number
*/
declare function LOS(who: ObjectPtr, range: number): boolean;

/**
 * Returns true only if the morale of the specified object is equal to the second parameter.
 * @param who ObjectPtr
 * @param morale number
*/
declare function Morale(who: ObjectPtr, morale: number): boolean;

/**
 * Returns true only if the morale of the specified object is greater than thesecond parameter.
 * @param who ObjectPtr
 * @param morale number
*/
declare function MoraleGT(who: ObjectPtr, morale: number): boolean;

/**
 * Returns true only if the morale of the specified object is less than the second parameter.
 * @param who ObjectPtr
 * @param morale number
*/
declare function MoraleLT(who: ObjectPtr, morale: number): boolean;

/**
 * Returns true only if the Race of the specified object is the same as that specified by the 2nd parameter.
 * @param who ObjectPtr
 * @param race Race
*/
declare function Race(who: ObjectPtr, race: Race): boolean;

/**
 * Returns true only if the specified object is within distance given (in feet) of the active CRE. Range seems limited to the default visual range (30), and does not bypass objects. Range is affected by foot circle size (e.g. the minimum range for a huge foot circle creature (Dragon) is 8). Melee range is 4.
 * @param who ObjectPtr
 * @param range number
*/
declare function Range(who: ObjectPtr, range: number): boolean;

/**
 * Returns true only if the reputation of the specified object is equal to the second parameter.
 * @param who ObjectPtr
 * @param reputation number
*/
declare function Reputation(who: ObjectPtr, reputation: number): boolean;

/**
 * Returns true only if the reputation of the specified object is greater than the second parameter.
 * @param who ObjectPtr
 * @param reputation number
*/
declare function ReputationGT(who: ObjectPtr, reputation: number): boolean;

/**
 * Returns true only if the reputation of the specified object is greater than the second parameter.
 * @param who ObjectPtr
 * @param reputation number
*/
declare function ReputationLT(who: ObjectPtr, reputation: number): boolean;

/**
 * Returns true only if the active CRE can see the specified object which must not be hidden or invisible.
 * @param who ObjectPtr
*/
declare function See(who: ObjectPtr): boolean;

/**
 * Returns true only if the specifics (as set in the CRE file or by the ChangeSpecifics action) of the specified object is equal to the 2nd parameter.
 * @param who ObjectPtr
 * @param specifics Specific
*/
declare function Specifics(who: ObjectPtr, specifics: Specific): boolean;

/**
 * Returns true only if the period of day matches the period in the 2nd parameter (taken from Time.ids). Hours are offset by 30 minutes, e.g. Time(1) is true between 00:30 and 01:29.
 * @param time Time
*/
declare function Time(time: Time): boolean;

/**
 * As above but less specific and uses TimeODay.ids.
 * @param timeOfDay TimeODay
*/
declare function TimeOfDay(timeOfDay: TimeODay): boolean;

/**
 * Returns true only if the active CRE was hit by the specifed object by the specified damage type in the last script round. If the damage type is CRUSHING or 0 then this will return true for ANY damage type. !HitBy returns true when the script is first activated (e.g. initial area load) and when hit by any damage type.
 * @param who ObjectPtr
 * @param dameType Damages
*/
declare function HitBy(who: ObjectPtr, dameType: Damages): boolean;

/**
 * Returns true only if the specified key was pressed in the last script round. Hotkeys defined in keymap.ini take precedence over hotkeys expected by this trigger.
 * @param key HotKey
*/
declare function HotKey(key: HotKey): boolean;

/**
 * Returns true only if the local timer with the specified ID has expired. This action does not work as a state or response trigger in dialogs.
 * @param iD number
*/
declare function TimerExpired(iD: number): boolean;

/**
 * Always returns true.
*/
declare function True(): boolean;

/**
 * Used as a form of script communication, in conjunction with the SendTrigger() action. Seems to have the same range as GiveOrder, and affects only one creature at once. The LastTrigger object does not get set after receiving a trigger.
 * @param triggerNum number
*/
declare function Trigger(triggerNum: number): boolean;

/**
 * Returns true if the active CRE has died in the last script round. NB. When a block returns true to this trigger, this will be the final block executed in the script, unless it is Continue'd
*/
declare function Die(): boolean;

/**
 * Returns true only if an action from the Attack, Spell or UseItem families that targeted the object specified cannot work with that target any more. That can happen from it not being in the area, deactivation, imprisonment, invisibility and sanctuary (provided true seeing options are not in play).
 * @param who ObjectPtr
*/
declare function TargetUnreachable(who: ObjectPtr): boolean;

/**
 * Delays the next check of the block of triggers where this trigger is, by the number of seconds specified. This value is not stored when the game is saved.
 * @param delay number
*/
declare function Delay(delay: number): boolean;

/**
 * Returns true only if the number of creatures of the type specified in sight of the active CRE are equal to the 2nd parameter.
 * @param who ObjectPtr
 * @param number number
*/
declare function NumCreature(who: ObjectPtr, number: number): boolean;

/**
 * As above except for less than.
 * @param who ObjectPtr
 * @param number number
*/
declare function NumCreatureLT(who: ObjectPtr, number: number): boolean;

/**
 * As above except for greater than.
 * @param who ObjectPtr
 * @param number number
*/
declare function NumCreatureGT(who: ObjectPtr, number: number): boolean;

/**
 * Returns true only if the active CRE has no actions waiting to be performed, i.e. is idle.
*/
declare function ActionListEmpty(): boolean;

/**
 * See HP(O:Object*,I:Hit Points*) except this is for a percentage.
 * @param who ObjectPtr
 * @param hitPoints number
*/
declare function HPPercent(who: ObjectPtr, hitPoints: number): boolean;

/**
 * See HPLT(O:Object*,I:Hit Points*) except this is for a percentage.
 * @param who ObjectPtr
 * @param hitPoints number
*/
declare function HPPercentLT(who: ObjectPtr, hitPoints: number): boolean;

/**
 * See HPGT(O:Object*,I:Hit Points*) except this is for a percentage.
 * @param who ObjectPtr
 * @param hitPoints number
*/
declare function HPPercentGT(who: ObjectPtr, hitPoints: number): boolean;

/**
 * Returns true only if the active CRE was within 30 feet of the specified object and the specified object shouted the specified number (which does not have to be in SHOUTIDS.ids) in the last script round. NB. If the object is specified as a death variable, the trigger will only return true if the corresponding object shouting also has an Enemy-Ally flag of NEUTRAL.
 * @param who ObjectPtr
 * @param iD SHOUTIDS
*/
declare function Heard(who: ObjectPtr, iD: SHOUTIDS): boolean;

/**
 * Never returns true, i.e. is always false. A block of triggers containing this will never return true regardless of the other triggers in the block. The corresponding actions will never take place.
*/
declare function False(): boolean;

/**
 * Returns true only if the active CRE has the specified spell memorised.
 * @param spell SpellID
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
 * See Global(S:Name*,S:Area*,I:Value*) except the variable must be greater than the value specified to be true.
 * @param name string
 * @param area string
 * @param value number
*/
declare function GlobalGT(name: string, area: string, value: number): boolean;

/**
 * As above except for less than.
 * @param name string
 * @param area string
 * @param value number
*/
declare function GlobalLT(name: string, area: string, value: number): boolean;

/**
 * Returns true if the script is processed for the first time this session, e.g. when a creature is created (for CRE scripts) or when the player enters an area (for ARE scripts).
*/
declare function OnCreation(): boolean;

/**
 * Returns true only if the specified object is in the state specified.
 * @param who ObjectPtr
 * @param state State
*/
declare function StateCheck(who: ObjectPtr, state: State): boolean;

/**
 * Exact opposite of above.
 * @param who ObjectPtr
 * @param state State
*/
declare function NotStateCheck(who: ObjectPtr, state: State): boolean;

/**
 * Returns true only if the player's party has spoken to the active CRE the exact number of times specified. NB. NumTimesTalkedTo seems to increment when a PCinitiates conversion with an NPC, or an NPC initiates conversation with a PC. NumTimesTalkedTo does not seem to increment for force-talks, interactions, interjections and self-talking.
 * @param num number
*/
declare function NumTimesTalkedTo(num: number): boolean;

/**
 * Returns true only if the player's party has spoken to the active CRE more than the number of times specified.
 * @param num number
*/
declare function NumTimesTalkedToGT(num: number): boolean;

/**
 * Returns true only if the player's party has spoken to the active CRE less than the number of times specified.
 * @param num number
*/
declare function NumTimesTalkedToLT(num: number): boolean;

/**
 * Returns true only if the reaction of the object specified (on the friendly-hostile scale) to the player was as specified. NB. Reaction = 10 + rmodchr + rmodrep (see rmodchr.2da and rmodrep.2da).
 * @param who ObjectPtr
 * @param value Reaction
*/
declare function Reaction(who: ObjectPtr, value: Reaction): boolean;

/**
 * Returns true if the reaction of the object specified (on the friendly-hostile scale) to the player was greater than specified. NB. Reaction = 10 + rmodchr + rmodrep (see rmodchr.2da and rmodrep.2da).
 * @param who ObjectPtr
 * @param value Reaction
*/
declare function ReactionGT(who: ObjectPtr, value: Reaction): boolean;

/**
 * Returns true if the reaction of the object specified (on the friendly-hostile scale) to the player was lower than specified. NB. Reaction = 10 + rmodchr + rmodrep (see rmodchr.2da and rmodrep.2da).
 * @param who ObjectPtr
 * @param value Reaction
*/
declare function ReactionLT(who: ObjectPtr, value: Reaction): boolean;

/**
 * NT
 * @param name string
 * @param area string
*/
declare function GlobalTimerExact(name: string, area: string): boolean;

/**
 * Returns true only if the timer with the name specified and of the type in the 2nd parameter has run and expired.
 * @param name string
 * @param area string
*/
declare function GlobalTimerExpired(name: string, area: string): boolean;

/**
 * Returns true only if the timer with the name specified and of the type in the 2nd parameter is still running. Note that if we use !GlobalTimerNotExpired(S:Name*,S:Area*) this will return true if the timer has never been set OR if it has already expired- very useful...most useful of all the GlobalTimer triggers :) .
 * @param name string
 * @param area string
*/
declare function GlobalTimerNotExpired(name: string, area: string): boolean;

/**
 * Returns true if any of the party members have the specified item in their inventory. This trigger also checks with container items (e.g. Bags of Holding).
 * @param item string
*/
declare function PartyHasItem(item: string): boolean;

/**
 * Returns true only if the specifed object is in the player's party.
 * @param who ObjectPtr
*/
declare function InParty(who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has the statistic in the 3rd parameter at the value of the 2nd parameter.
 * @param who ObjectPtr
 * @param value number
 * @param statNum Stats
*/
declare function CheckStat(who: ObjectPtr, value: number, statNum: Stats): boolean;

/**
 * Returns true only if the specified object has the statistic in the 3rd parameter greater than the value of the 2nd parameter.
 * @param who ObjectPtr
 * @param value number
 * @param statNum Stats
*/
declare function CheckStatGT(who: ObjectPtr, value: number, statNum: Stats): boolean;

/**
 * Returns true only if the specified object has the statistic in the 3rd parameter less than the value of the 2nd parameter.
 * @param who ObjectPtr
 * @param value number
 * @param statNum Stats
*/
declare function CheckStatLT(who: ObjectPtr, value: number, statNum: Stats): boolean;

/**
 * Generates a random number between 1 and Range. Returns true only if the random number equals the 2nd parameter.
 * @param range number
 * @param value number
*/
declare function RandomNum(range: number, value: number): boolean;

/**
 * NT As above except returns true only if the random number is greater than the 2nd parameter.
 * @param range number
 * @param value number
*/
declare function RandomNumGT(range: number, value: number): boolean;

/**
 * NT As above except returns true only if the random number is less than the 2nd parameter.
 * @param range number
 * @param value number
*/
declare function RandomNumLT(range: number, value: number): boolean;

/**
 * Returns true only if the specifed object died in the last script round.
 * @param who ObjectPtr
*/
declare function Died(who: ObjectPtr): boolean;

/**
 * NT Returns true if the active CRE killed the specified object in the last script round.
 * @param who ObjectPtr
*/
declare function Killed(who: ObjectPtr): boolean;

/**
 * Only for trigger regions in areas. Returns true only if the specified object entered the trigger region in the last script round.
 * @param who ObjectPtr
*/
declare function Entered(who: ObjectPtr): boolean;

/**
 * Returns true only if the gender of the specified object is that given in the 2nd parameter.
 * @param who ObjectPtr
 * @param sex Gender
*/
declare function Gender(who: ObjectPtr, sex: Gender): boolean;

/**
 * Returns true only if the player's party has the amount of gold specified in the 2nd parameter.
 * @param amount number
*/
declare function PartyGold(amount: number): boolean;

/**
 * Returns true only if the player's party has more gold than specified in the 2nd parameter.
 * @param amount number
*/
declare function PartyGoldGT(amount: number): boolean;

/**
 * Returns true only if the player's party has less gold than specified in the 2nd parameter.
 * @param amount number
*/
declare function PartyGoldLT(amount: number): boolean;

/**
 * Returns only true if the creature with the specified script name has its death variable set to 1. Not every form of death sets this, but most do. So it's an almost complete test for death. The creature must have existed for this to be true. Note that SPRITE_IS_DEAD variables are not set if the creaure is killed by a neutral creature.
 * @param name string
*/
declare function Dead(name: string): boolean;

/**
 * Only for door scripts. Returns true only if the specified object opened the active door in the last script round.
 * @param who ObjectPtr
*/
declare function Opened(who: ObjectPtr): boolean;

/**
 * Only for door scripts. Returns true only if the specified object closed the active door in the last script round.
 * @param who ObjectPtr
*/
declare function Closed(who: ObjectPtr): boolean;

/**
 * Only for trap scripts. Returns true only if the specified object detected this trap in the last script round.
 * @param who ObjectPtr
*/
declare function Detected(who: ObjectPtr): boolean;

/**
 * Only for trap scripts. Returns true only if this trap or trigger was reset in the last script round by the object specified.
 * @param who ObjectPtr
*/
declare function Reset(who: ObjectPtr): boolean;

/**
 * Only for trap/trigger region scripts. Returns true only if the specified object disarmed this trap in the last script round.
 * @param who ObjectPtr
*/
declare function Disarmed(who: ObjectPtr): boolean;

/**
 * Only for door scripts - returns true only if this door was unlocked by the specified object in the last script round. Appears to be broken.
 * @param who ObjectPtr
*/
declare function Unlocked(who: ObjectPtr): boolean;

/**
 * Seems to be broken. Returns true only if the active CRE has no ammunition for the current ranged weapon.
*/
declare function OutOfAmmo(): boolean;

/**
 * NT Returns true only if the specified NPC has interacted with the party a number of times equal to the 2nd parameter.
 * @param npc NPC
 * @param num number
*/
declare function NumTimesInteracted(npc: NPC, num: number): boolean;

/**
 * NT Returns true only if the specified NPC has interacted with the party a number of times greater than the 2nd parameter.
 * @param npc NPC
 * @param num number
*/
declare function NumTimesInteractedGT(npc: NPC, num: number): boolean;

/**
 * NT Returns true only if the specified NPC has interacted with the party a number of times less than the 2nd parameter.
 * @param npc NPC
 * @param num number
*/
declare function NumTimesInteractedLT(npc: NPC, num: number): boolean;

/**
 * Checks the current creatures happiness value. Note that this trigger is only evaluated when the happiness value is checked (at all other times this trigger returns false).
*/
declare function BreakingPoint(): boolean;

/**
 * Seems to be broken. Not used in any existing scripts.
 * @param who ObjectPtr
*/
declare function PickPocketFailed(who: ObjectPtr): boolean;

/**
 * For shopkeepers. Returns true if the specified object failed to steal from the shop in the last script round.
 * @param who ObjectPtr
*/
declare function StealFailed(who: ObjectPtr): boolean;

/**
 * NT Not used in any existing scripts.
 * @param who ObjectPtr
*/
declare function DisarmFailed(who: ObjectPtr): boolean;

/**
 * NT Not used in any existing scripts.
 * @param who ObjectPtr
*/
declare function PickLockFailed(who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has the specified item in its inventory. This trigger also checks with container items (e.g. Bags of Holding).
 * @param resource Resref
 * @param who ObjectPtr
*/
declare function HasItem(resource: Resref, who: ObjectPtr): boolean;

/**
 * NT Returns true only if the active CRE is interacting (dialogue.) with the specified object.
 * @param who ObjectPtr
*/
declare function InteractingWith(who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object is within the range of the active CRE's currently equipped weapon.
 * @param who ObjectPtr
*/
declare function InWeaponRange(who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has a weapon in a quickslot.
 * @param who ObjectPtr
*/
declare function HasWeaponEquiped(who: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object has the specified happiness value.
 * @param who ObjectPtr
 * @param amount Happy
*/
declare function Happiness(who: ObjectPtr, amount: Happy): boolean;

/**
 * NT Returns true only if the specified object has greater than the specified happiness value.
 * @param who ObjectPtr
 * @param amount Happy
*/
declare function HappinessGT(who: ObjectPtr, amount: Happy): boolean;

/**
 * NT Returns true only if the specified object has less than the specified happiness value.
 * @param who ObjectPtr
 * @param amount Happy
*/
declare function HappinessLT(who: ObjectPtr, amount: Happy): boolean;

/**
 * Returns true only if the current time is greater than that specified. Hours are offset by 30 minutes, e.g. TimeGT(1) is true between 01:30 and 02:29.
 * @param time Time
*/
declare function TimeGT(time: Time): boolean;

/**
 * Returns true only if the current time is less than that specified. Hours are offset by 30 minutes, e.g. TimeLT(1) is true between 23:30 and 00:29.
 * @param time Time
*/
declare function TimeLT(time: Time): boolean;

/**
 * Returns true only if the number of party members (dead ones also count) is equal to the number specified.
 * @param num number
*/
declare function NumInParty(num: number): boolean;

/**
 * Returns true only if the number of party members (dead ones also count) is greater than the number specified.
 * @param num number
*/
declare function NumInPartyGT(num: number): boolean;

/**
 * Returns true only if the number of party members (dead ones also count) is less than the number specified.
 * @param num number
*/
declare function NumInPartyLT(num: number): boolean;

/**
 * Returns true only if the active creature is for exactly the specified number of ticks (1/15th seconds) left under the effect of the script action MakeUnselectable().
 * @param num number
*/
declare function UnselectableVariable(num: number): boolean;

/**
 * Returns true only if the active creature is for more than the specified number of ticks (1/15th seconds) left under the effect of the script action MakeUnselectable().
 * @param num number
*/
declare function UnselectableVariableGT(num: number): boolean;

/**
 * Returns true only if the active creature is for less than the specified number of ticks (1/15th seconds) left under the effect of the script action MakeUnselectable().
 * @param num number
*/
declare function UnselectableVariableLT(num: number): boolean;

/**
 * Only for trigger regions. Returns true if the specified object clicked on the trigger region running this script.
 * @param who ObjectPtr
*/
declare function Clicked(who: ObjectPtr): boolean;

/**
 * Returns true only if the number of times the party has spoken to this creature is equal to the number specified.
 * @param num number
*/
declare function NumberOfTimesTalkedTo(num: number): boolean;

/**
 * Returns true only if the number of creatures with script name "Name" that have been killed is equal to the 2nd parameter.
 * @param name string
 * @param num number
*/
declare function NumDead(name: string, num: number): boolean;

/**
 * Returns true only if the number of creatures with script name "Name" that have been killed is greater than the 2nd parameter.
 * @param name string
 * @param num number
*/
declare function NumDeadGT(name: string, num: number): boolean;

/**
 * Returns true only if the number of creatures with script name "Name" that have been killed is less than the 2nd parameter.
 * @param name string
 * @param num number
*/
declare function NumDeadLT(name: string, num: number): boolean;

/**
 * Returns true if the the specified object is detected by the active CRE in any way (hearing or sight). Neither Move Silently and Hide in Shadows prevent creatures being detected via Detect(). Detect ignores Protection from Creature type effects for static objects.
 * @param who ObjectPtr
*/
declare function Detect(who: ObjectPtr): boolean;

/**
 * Returns true only if the item specified in parameter 1 is in the container specified in parameter 2.
 * @param resource Resref
 * @param who ObjectPtr
*/
declare function Contains(resource: Resref, who: ObjectPtr): boolean;

/**
 * NT Returns true only if the open state of the specified door matches the state specified in the 2nd parameter.
 * @param who ObjectPtr
 * @param open boolean
*/
declare function OpenState(who: ObjectPtr, open: boolean): boolean;

/**
 * Returns true only if the specified object has the number of items in the 3rd parameter of the type specified in the 1st parameter in its inventory.
 * @param resource Resref
 * @param who ObjectPtr
 * @param num number
*/
declare function NumItems(resource: Resref, who: ObjectPtr, num: number): boolean;

/**
 * Returns true only if the specified object has more than the number of items in the 3rd parameter of the type specified in the 1st parameter in its inventory.
 * @param resource Resref
 * @param who ObjectPtr
 * @param num number
*/
declare function NumItemsGT(resource: Resref, who: ObjectPtr, num: number): boolean;

/**
 * Returns true only if the specified object has fewer than the number of items in the 3rd parameter of the type specified in the 1st parameter in its inventory.
 * @param resource Resref
 * @param who ObjectPtr
 * @param num number
*/
declare function NumItemsLT(resource: Resref, who: ObjectPtr, num: number): boolean;

/**
 * Returns true only if the party has a total number of items of the type specified equal to the 2nd parameter.
 * @param resource Resref
 * @param num number
*/
declare function NumItemsParty(resource: Resref, num: number): boolean;

/**
 * Returns true only if the party has a total number of items of the type specified greater than the 2nd parameter.
 * @param resource Resref
 * @param num number
*/
declare function NumItemsPartyGT(resource: Resref, num: number): boolean;

/**
 * Returns true only if the party has a total number of items of the type specified less than the 2nd parameter.
 * @param resource Resref
 * @param num number
*/
declare function NumItemsPartyLT(resource: Resref, num: number): boolean;

/**
 * Only for trigger regions. Returns true only if the specified object is over the trigger running the script.
 * @param who ObjectPtr
*/
declare function IsOverMe(who: ObjectPtr): boolean;

/**
 * Returns true only if the active CRE is in the area specified.
 * @param resource Resref
*/
declare function AreaCheck(resource: Resref): boolean;

/**
 * Returns true if the specified object has the specified item outside the general inventory slots (does not check for equipped status). This trigger does not work for Melf's Minute Meteors or other magically created weapons.
 * @param resource Resref
 * @param who ObjectPtr
*/
declare function HasItemEquiped(resource: Resref, who: ObjectPtr): boolean;

/**
 * Returns true if the number of hostile creatures of the type specified in the 1st parameter that are currently in fighting range of the party, minus the number of party members, is equal to the 2nd parameter.
 * @param who ObjectPtr
 * @param number number
*/
declare function NumCreatureVsParty(who: ObjectPtr, number: number): boolean;

/**
 * Returns true if the number of hostile creatures of the type specified in the 1st parameter that are currently in fighting range of the party, minus the number of party members, is less than the 2nd parameter.
 * @param who ObjectPtr
 * @param number number
*/
declare function NumCreatureVsPartyLT(who: ObjectPtr, number: number): boolean;

/**
 * Returns true if the number of hostile creatures of the type specified in the 1st parameter that are currently in fighting range of the party, minus the number of party members, is greater than the 2nd parameter.
 * @param who ObjectPtr
 * @param number number
*/
declare function NumCreatureVsPartyGT(who: ObjectPtr, number: number): boolean;

/**
 * This trigger does may not work as expected. Returns true only if the combat counter (counts down from 150 after each attack) is of the value specified. CombatCounter(0) returns true only if there is no combat in the active area at the moment. CombatCounter can give false results after dialog has been completed or after a Hide in Shadows chck has been failed.
 * @param number number
*/
declare function CombatCounter(number: number): boolean;

/**
 * Returns true only if the combat counter (counts down from 150 after each attack) is less than the value specified.
 * @param number number
*/
declare function CombatCounterLT(number: number): boolean;

/**
 * This trigger does not work as expected. Returns true only if the combat counter (counts down from 150 after each attack) is greater than the value specified. CombatCounterGT(0) returns true if there is any combat going on in the active area.
 * @param number number
*/
declare function CombatCounterGT(number: number): boolean;

/**
 * Returns true only if the area in which the active CRE is, has the specified type flag set. Note that the value is OR'd. This trigger can cause a crash if it evaluates to true and is used as the first trigger in a dead NPCs dream script.
 * @param areatype AreaType
*/
declare function AreaType(areatype: AreaType): boolean;

/**
 * NT Only for trigger regions/traps. Returns true if this trap was triggered by the object specified.
 * @param triggerer ObjectPtr
*/
declare function TrapTriggered(triggerer: ObjectPtr): boolean;

/**
 * NT Returns true only if the party member specified died in the last script round.
 * @param who ObjectPtr
*/
declare function PartyMemberDied(who: ObjectPtr): boolean;

/**
 * Returns true if any of the next 'OrCount' triggers returns true.
 * @param orCount number
*/
declare function OR(orCount: number): boolean;

/**
 * Returns true only if the specified object is in the party and in the slot specified (slots are 0-5). Party slots are based on join order; Player1 is in slot 0, Player2 in slot 1 etc.
 * @param who ObjectPtr
 * @param slot number
*/
declare function InPartySlot(who: ObjectPtr, slot: number): boolean;

/**
 * Returns true only if the specified object cast the spell in the 2nd paramater in the last script round.
 * @param who ObjectPtr
 * @param spell SpellID
*/
declare function SpellCast(who: ObjectPtr, spell: SpellID): boolean;

/**
 * InLine(S:Target*,O:Object*) seems to have no effect. InLine(O:Object*) returns true if the active creature can see the target creature.
 * @param target string
 * @param who ObjectPtr
*/
declare function InLine(target: string, who: ObjectPtr): boolean;

/**
 * Returns true if the party has just finished resting.
*/
declare function PartyRested(): boolean;

/**
 * Returns true only if the experience level of the specified object equals the 2nd parameter.
 * @param who ObjectPtr
 * @param level number
*/
declare function Level(who: ObjectPtr, level: number): boolean;

/**
 * Returns true only if the experience level of the specified object is greater than the 2nd parameter.
 * @param who ObjectPtr
 * @param level number
*/
declare function LevelGT(who: ObjectPtr, level: number): boolean;

/**
 * Returns true only if the experience level of the specified object is less than the 2nd parameter.
 * @param who ObjectPtr
 * @param level number
*/
declare function LevelLT(who: ObjectPtr, level: number): boolean;

/**
 * NT Returns true only if the active CRE summoned the specified object in the last script round.
 * @param who ObjectPtr
*/
declare function Summoned(who: ObjectPtr): boolean;

/**
 * Returns true only if the 2 global variables specified have equal values.
 * @param name1 string
 * @param name2 string
*/
declare function GlobalsEqual(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st global variable has a value greater than the 2nd one.
 * @param name1 string
 * @param name2 string
*/
declare function GlobalsGT(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st global variable has a value less than the 2nd one.
 * @param name1 string
 * @param name2 string
*/
declare function GlobalsLT(name1: string, name2: string): boolean;

/**
 * Returns true only if the 2 local variables specified have equal values.
 * @param name1 string
 * @param name2 string
*/
declare function LocalsEqual(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st local variable has a value less than the 2nd one.
 * @param name1 string
 * @param name2 string
*/
declare function LocalsGT(name1: string, name2: string): boolean;

/**
 * Returns true only if the 1st local variable has a value less than the 2nd one.
 * @param name1 string
 * @param name2 string
*/
declare function LocalsLT(name1: string, name2: string): boolean;

/**
 * Returns true only if the specified object has no actions waiting to be performed.
 * @param who ObjectPtr
*/
declare function ObjectActionListEmpty(who: ObjectPtr): boolean;

/**
 * Returns true if the specified object is on the screen.
 * @param who ObjectPtr
*/
declare function OnScreen(who: ObjectPtr): boolean;

/**
 * Returns true only if specified object is in the active area. The active area is that in which player 1 is. This trigger will crash the game if the specified creature is not in the active area and is not a global object.
 * @param who ObjectPtr
*/
declare function InActiveArea(who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object cast the specified spell on the active CRE in the last scriptround. Returns false for spells whose Ability target (offset 0xC) is 4 (Any point within range).
 * @param caster ObjectPtr
 * @param spell SpellID
*/
declare function SpellCastOnMe(caster: ObjectPtr, spell: SpellID): boolean;

/**
 * NT Returns true only if the current day is the day specified.
 * @param day number
*/
declare function CalanderDay(day: number): boolean;

/**
 * NT Returns true only if the current day is after the day specified.
 * @param day number
*/
declare function CalanderDayGT(day: number): boolean;

/**
 * NT Returns true only if the current day is before the day specified.
 * @param day number
*/
declare function CalanderDayLT(day: number): boolean;

/**
 * Returns true only if the object in the 2nd parameter has the scriptname specified.
 * @param name string
 * @param who ObjectPtr
*/
declare function Name(name: string, who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object cast the specified priest spell in the last script round.
 * @param who ObjectPtr
 * @param spell SpellID
*/
declare function SpellCastPriest(who: ObjectPtr, spell: SpellID): boolean;

/**
 * Returns true only if the specified object cast the specified innate spell in the last script round. NB. The spell level must match the spells definition (in spell.ids) for the trigger to return true.
 * @param who ObjectPtr
 * @param spell SpellID
*/
declare function SpellCastInnate(who: ObjectPtr, spell: SpellID): boolean;

/**
 * 
 * @param who ObjectPtr
*/
declare function IsValidForPartyDialog(who: ObjectPtr): boolean;

/**
 * 
 * @param who ObjectPtr
*/
declare function IfValidForPartyDialog(who: ObjectPtr): boolean;

/**
 * 
 * @param who ObjectPtr
*/
declare function IsValidForPartyDialogue(who: ObjectPtr): boolean;

/**
 * Returns true only if that specifed party member can take part in party dialogue.
 * @param who ObjectPtr
*/
declare function IfValidForPartyDialogue(who: ObjectPtr): boolean;

/**
 * Returns true only if the party has the item specified and it is identified.
 * @param resource Resref
*/
declare function PartyHasItemIdentified(resource: Resref): boolean;

/**
 * Returns true if any of the specified object is currently affected by any of the listed effects:
 * @param who ObjectPtr
*/
declare function HasBounceEffects(who: ObjectPtr): boolean;

/**
 * Returns true if any of the specified object is currently affected by any of the listed effects:
 * @param who ObjectPtr
*/
declare function HasImmunityEffects(who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object has an item in the specified slot. This trigger does not work for Melf's Minute Meteors.
 * @param who ObjectPtr
 * @param slot SLOTS
*/
declare function HasItemSlot(who: ObjectPtr, slot: SLOTS): boolean;

/**
 * NT Returns true if the specified object exactly as far away from the active CRE as the 2nd parameter specifies.
 * @param who ObjectPtr
 * @param range number
*/
declare function PersonalSpaceDistance(who: ObjectPtr, range: number): boolean;

/**
 * Returns true only if the specifics value of the specified object is the same as that of the active CRE.
 * @param who ObjectPtr
*/
declare function InMyGroup(who: ObjectPtr): boolean;

/**
 * NT
 * @param name string
 * @param area string
*/
declare function RealGlobalTimerExact(name: string, area: string): boolean;

/**
 * NT Returns true only if the timer with the specified name of the specified area has been set at least once and has now expired.
 * @param name string
 * @param area string
*/
declare function RealGlobalTimerExpired(name: string, area: string): boolean;

/**
 * NT Returns true only if the timer with the specified name of the specified area has been set and has not yet expired.
 * @param name string
 * @param area string
*/
declare function RealGlobalTimerNotExpired(name: string, area: string): boolean;

/**
 * Returns true only if the number of party members alive is equal to the number specified.
 * @param num number
*/
declare function NumInPartyAlive(num: number): boolean;

/**
 * Returns true only if the number of party members alive is greater than the number specified.
 * @param num number
*/
declare function NumInPartyAliveGT(num: number): boolean;

/**
 * Returns true only if the number of party members alive is less than the number specified.
 * @param num number
*/
declare function NumInPartyAliveLT(num: number): boolean;

/**
 * NT Returns true only if the specified object is of the kit specified. NB. A creature's assigned kit is stored as a dword, however the Kit() trigger only checks the upper word. This, in conjunction with various incorrect values in the game cre files, and an incorrect kits.ids file, means the Kit() trigger can often fail. For optimal usage, the default kit.ids file should be replaced with the updated one listed in the BG2: ToB ids page.
 * @param who ObjectPtr
 * @param kit KIT
*/
declare function Kit(who: ObjectPtr, kit: KIT): boolean;

/**
 * Returns true only if the specified object is the current speaker (in a dialog).
 * @param who ObjectPtr
*/
declare function IsGabber(who: ObjectPtr): boolean;

/**
 * Returns true if the specified creature is active and false if it is deactivated. A creature will continue to execute script blocks even while deactivated - this trigger can be used to restrict this behaviour.
 * @param who ObjectPtr
*/
declare function IsActive(who: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object has the character name specified.
 * @param name string
 * @param who ObjectPtr
*/
declare function CharName(name: string, who: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object is a fallen ranger.
 * @param who ObjectPtr
*/
declare function FallenRanger(who: ObjectPtr): boolean;

/**
 * NT Returns true only if the specified object is a fallen ranger.
 * @param who ObjectPtr
*/
declare function FallenPaladin(who: ObjectPtr): boolean;

/**
 * Returns true only if the specified object can carry no more items.
 * @param who ObjectPtr
*/
declare function InventoryFull(who: ObjectPtr): boolean;

/**
 * Returns true if the specified object has the specified item outside the general inventory slots. Unlike HasItemEquiped it only checks the equipped weapon slot, not all of them. This trigger does not work for Melf's Minute Meteors or other magically created weapons.
 * @param resource Resref
 * @param who ObjectPtr
*/
declare function HasItemEquipedReal(resource: Resref, who: ObjectPtr): boolean;

/**
 * Returns true if the specified object has experience points equal to the number specified.
 * @param who ObjectPtr
 * @param xP number
*/
declare function XP(who: ObjectPtr, xP: number): boolean;

/**
 * Returns true if the specified object has experience points greater than the number specified.
 * @param who ObjectPtr
 * @param xP number
*/
declare function XPGT(who: ObjectPtr, xP: number): boolean;

/**
 * Returns true if the specified object has experience points less than the number specified.
 * @param who ObjectPtr
 * @param xP number
*/
declare function XPLT(who: ObjectPtr, xP: number): boolean;

/**
 * This trigger acts as a shortcut for Global(). The trigger can only check global variables.
 * @param resource Resref
 * @param num number
*/
declare function G(resource: Resref, num: number): boolean;

/**
 * This trigger acts as a shortcut for GlobalGT(). The trigger can only check global variables.
 * @param resource Resref
 * @param num number
*/
declare function GGT(resource: Resref, num: number): boolean;

/**
 * This trigger acts as a shortcut for GlobalLT(). The trigger can only check global variables.
 * @param resource Resref
 * @param num number
*/
declare function GLT(resource: Resref, num: number): boolean;

/**
 * Returns true only if the active CRE is in the state/mode specified. e.g. detecting traps.
 * @param state MODAL
*/
declare function ModalState(state: MODAL): boolean;

/**
 * Returns true only if the specified object is in the same area as the active CRE.
 * @param who ObjectPtr
*/
declare function InMyArea(who: ObjectPtr): boolean;

/**
 * Returns true if some type of damage was caused to the active CRE (and HP were lost) in the last script round.
*/
declare function TookDamage(): boolean;

/**
 * Returns true if the total damage taken by the active CRE is of the amount specified. Think of this as the reverse of testing for HP. See HP.
 * @param amount number
*/
declare function DamageTaken(amount: number): boolean;

/**
 * See above and HPGT. Note: This trigger may not act correctly until the active creature has dropped below their maximum base HP (i.e. without CON bonus taken into account).
 * @param amount number
*/
declare function DamageTakenGT(amount: number): boolean;

/**
 * See above and HPLT.
 * @param amount number
*/
declare function DamageTakenLT(amount: number): boolean;

/**
 * NT Returns true only if the game difficulty setting is of the level specified.
 * @param amount DIFFLEV
*/
declare function Difficulty(amount: DIFFLEV): boolean;

/**
 * NT Returns true only if the game difficulty setting is greater than the level specified.
 * @param amount DIFFLEV
*/
declare function DifficultyGT(amount: DIFFLEV): boolean;

/**
 * NT Returns true only if the game difficulty setting is less than the level specified.
 * @param amount DIFFLEV
*/
declare function DifficultyLT(amount: DIFFLEV): boolean;

/**
 * NT Returns true if the specified object which can be dead or alive is in the party.
 * @param who ObjectPtr
*/
declare function InPartyAllowDead(who: ObjectPtr): boolean;

/**
 * Returns true if the specified object is in the area specified. This trigger can cause a crash if the specified area is not loaded.
 * @param resource Resref
 * @param who ObjectPtr
*/
declare function AreaCheckObject(resource: Resref, who: ObjectPtr): boolean;

/**
 * Returns true if combat counter is greater than 0. Confirmed as working in SoA.
*/
declare function ActuallyInCombat(): boolean;

/**
 * NT Only for trigger regions. Returns true if the specified object has walked to this trigger.
 * @param who ObjectPtr
*/
declare function WalkedToTrigger(who: ObjectPtr): boolean;

/**
 * Returns true only if the average level of the party is equal to the number specified. Only the highest level of dual/multi-class characters is taken into account.
 * @param num number
*/
declare function LevelParty(num: number): boolean;

/**
 * Returns true only if the average level of the party is greater than the number specified. Only the highest level of dual/multi-class characters is taken into account.
 * @param num number
*/
declare function LevelPartyGT(num: number): boolean;

/**
 * Returns true only if the average level of the party is less than the number specified. Only the highest level of dual/multi-class characters is taken into account.
 * @param num number
*/
declare function LevelPartyLT(num: number): boolean;

/**
 * Returns true if any of the party members have the specified spell memorised.
 * @param spell SpellID
*/
declare function HaveSpellParty(spell: SpellID): boolean;

/**
 * ToB only. Returns true if the active CRE has the specified (by the string parameter) spell memorised.
 * @param spell string
*/
declare function HaveSpellRES(spell: string): boolean;

/**
 * ToB only. Returns true only if the active CRE is in a Watcher's Keep (i.e. the current area begins with AR30).
*/
declare function AmIInWatchersKeepPleaseIgnoreTheLackOfApostophe(): boolean;

/**
 * ToB only. Returns true only if the active CRE is in a Watcher's Keep (i.e. the current area begins with AR30).
*/
declare function InWatchersKeep(): boolean;