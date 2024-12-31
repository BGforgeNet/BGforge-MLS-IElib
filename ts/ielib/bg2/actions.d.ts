import type { Action, ObjectPtr, Point } from "../index";



/**
 * This action can be used to do nothing - many characters walk around randomly or stand in one place doing nothing:

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #50
      RandomWalk()
    RESPONSE #50
      NoAction()
  END
```

`NoAction()` is also commonly used as a hanging (dummy) action in targeting blocks. This is a matter of good practice rather than necessary. The `NoAction()` action will never be run since the block always returns false, but having an action in the scripting block allows scripting programs to accurately check for errors.

```weidu-baf
  IF
    See(NearestEnemyOf(Myself))
    False()
  THEN
    RESPONSE #100
      NoAction()
  END
```
 */
declare function NoAction(): void;

/**
 * This action can be used to control another creature. A creature referenced as the result of [SetTokenObject()](../actions/bgeeactions.htm#248) is not a valid target for the ActionOverride() action. The following is from the Irenicus cutscene after leaving his abode in chapter 1.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      CutSceneId(Player1)
      Wait(1)
      FadeToColor([20.0],0)
      Wait(2)
      JumpToPoint([869.340])
      MoveViewPoint([909.346],INSTANT)
      ActionOverride(Player2,JumpToPoint([825.370]))
      ActionOverride(Player3,JumpToPoint([886.384]))
      ActionOverride(Player4,JumpToPoint([952.386]))
      ActionOverride(Player5,JumpToPoint([987.362]))
      ActionOverride(Player6,JumpToPoint([1005.404]))
      Face(10)
      ActionOverride(Player2,Face(10))
      ActionOverride(Player3,Face(10))
      ActionOverride(Player4,Face(8))
      ActionOverride(Player5,Face(6))
      ActionOverride(Player6,Face(6))
      ActionOverride("Anomen",JumpToPoint([909.346]))
      ActionOverride("Anomen",Face(10))
      Wait(1)
      FadeFromColor([20.0],0)
      Wait(2)
      ActionOverride("Anomen",StartDialogueNoSet(Player1))
  END
```
 */
declare function ActionOverride(actor: ObjectPtr, action: Action): void;

/**
 * This action is used to change the allegiance of the active creature to enemy (making them hostile to the PC). This example script, from a peasant, will turn the creature hostile if it is attacked.

```weidu-baf
  IF
    AttackedBy([GOODCUTOFF],DEFAULT)
    Allegiance(Myself,NEUTRAL)
  THEN
    RESPONSE #100
      Enemy()
  END
```
 */
declare function Enemy(): void;

/**
 * This action gives the appearance of flying - the active creature is able to pass over impassable areas. The example script is from randfly.bcs.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      RandomFly()
  END
```
 */
declare function RandomFly(): void;

/**
 * This action is used internally by action 100 (RandomFly); it moves the active creature towards the given point for the specified amount of time.
 */
declare function FlyToPoint(point: Point, time: number): void;

/**
 * This action sets the morale of the active creature.
 */
declare function MoraleSet(target: ObjectPtr, morale: number): void;

/**
 * This action alters the morale of the target by the specified amount. The change amount can be positive or negative. The example script is from bardsh.bcs.

```weidu-baf
  IF
    AttackedBy([GOODCUTOFF],DEFAULT)
    Allegiance(Myself,NEUTRAL)
    Global("PlayerAttackedActors","GLOBAL",0)
  THEN
    RESPONSE #100
      SetGlobal("PlayerAttackedActors","GLOBAL",1)
      MoraleInc(Myself,-5)
      Enemy()
  END
```
 */
declare function MoraleInc(target: ObjectPtr, morale: number): void;

/**
 * This action alters the morale of the target by the specified amount. The change amount can be positive or negative.
 */
declare function MoraleDec(target: ObjectPtr, morale: number): void;

/**
 * This action instructs the active creature to attack the specified target for one round.

```weidu-baf
  IF
    See(NearestEnemyOf())
  THEN
    RESPONSE #100
      AttackOneRound(NearestEnemyOf())
  END
```
 */
declare function AttackOneRound(target: ObjectPtr): void;

/**
 * This action is used to shout the specified number. The action is used in conjunction with the Heard trigger. A silenced creature cannot shout. Shout can be Heard() throughout the current area.

```weidu-baf
  IF
    StateCheck(Myself,STATE_POISONED)
  THEN
    RESPONSE #100
      Shout(4010)
  END
```

```weidu-baf
  IF
    Heard([GOODCUTOFF],4010)
    HaveSpell(CLERIC_SLOW_POISON)
  THEN
    RESPONSE #100
      Spell(LastHeardBy(),CLERIC_SLOW_POISON)
  END
```
 */
declare function Shout(id: number): void;

/**
 * This action instructs the active creature to move a certain distance from its current location; i.e. the point is relative to the creatures current location.
 */
declare function MoveToOffset(offset: Point): void;

/**
 * 
 */
declare function EscapeAreaMove(area: string, x: number, y: number, face: number): void;

/**
 * This action, in its first form, instructs the active creature to leave the current area, either by walking, or, if the path is blocked, by simply disappearing. In the actions second form the action functions as a combination of EscapeAreaDestroy() and MoveBetweenAreas(). The parameters are similar to MoveBetweenAreas(), in that it takes in all the same information, but unlike MoveBetweenAreas(), the character will search for the nearest enabled travel trigger, move to that, then execute his movement to the specified area. If no travel trigger is found, the creature will just execute the movement.

The action is uninterruptable; actions listed this one in a script may not execute as intended.

```weidu-baf
  IF
    HPPercentLT(Myself,35)
  THEN
    RESPONSE #100
      EscapeArea()
  END
```
 */
declare function EscapeArea(): void;

/**
 * This action alters the specified variable, in the specified scope, by the amount indicated. The amount can be positive or negative. Variables in the local scope cannot be changed with this action.

```weidu-baf
  IF
    See([EVILCUTOFF]
    !Specifics(LastSeenBy(),160)
    !Inparty(LastSeenBy())
    !Allegiance(LastSeenBy([GOODCUTOFF])
  THEN
    RESPONSE #100
      ChangeSpecifics(LastSeenBy(),160)
      IncrementGlobal("KR_MONSTER_COUNTER_ALIVE","GLOBAL",1)
  END
```
 */
declare function IncrementGlobal(name: string, area: string, value: number): void;

/**
 * This action instructs the active creature to equip the specified item.

{% capture note %}
- Item must be in the creature's inventory for the script action to function.
- Item's global effects (`timing_mode=2`) are applied to the creature each time the action is performed, and avatar animations are updated to reflect the new item.
{% endcapture %} {% include info.html %}
 */
declare function EquipItem(object: string): void;

/**
 * This action changes the current area. Parchment is the MOS image to use in the area transition loading screen. Only EE games support IDS symbols for `Face`.

```weidu-baf
  IF
    Global("MissionPackSave","GLOBAL",0)
  THEN
    RESPONSE #100
      TextScreen("toscst")
      ActionOverride(Player1,LeaveAreaLUA("AR1000","",[3048.831],4))
      ActionOverride(Player2,LeaveAreaLUA("AR1000","",[3055.917],4))
      ActionOverride(Player3,LeaveAreaLUA("AR1000","",[2990.913],4))
      ActionOverride(Player4,LeaveAreaLUA("AR1000","",[2992.812],4))
      ActionOverride(Player5,LeaveAreaLUA("AR1000","",[3079.737],4))
      ActionOverride(Player6,LeaveAreaLUA("AR1000","",[3005.742],4))
  END
```
 */
declare function LeaveAreaLUA(area: string, parchment: string, point: Point, face: number): void;

/**
 * This action removes the active creature from the game. No death variable is set. Global creatures like 
joinable NPCs, familiars and recipients of `MakeGlobal` are still accessible by script name and are not
fully removed. The example script is from the Irenicus cutscene at the beginning of the game.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      CutSceneId("CSCowl7")
      ForceSpell("CSIren",0)
      Wait(1)
      DestroySelf()
  END
```
 */
declare function DestroySelf(): void;

/**
 * This action is used by the engine internally. An object id is expected in the in1 parameter.
 */
declare function UseContainer(): void;

/**
 * 
 */
declare function ForceSpellRES(res: string, target: ObjectPtr): void;

/**
 * 
 */
declare function ForceSpellRES(res: string, target: ObjectPtr, castinglevel: number): void;

/**
 * This action causes the active creature to cast the specified spell at the target object. The spell need not currently be memorised by the caster, and will not be interrupted while being cast. The caster must meet the level requirements of the spell. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long. The example script is from suelfw9.bcs.

```weidu-baf
  IF
    Global("Scene2","AR2800",2)
    See([ENEMY])
    Global("Fight","LOCALS",2)
  THEN
    RESPONSE #100
      IncrementGlobal("Fight","LOCALS",1)
      ForceSpell([ENEMY],WIZARD_POWER_WORD_SLEEP)
  END
```

{% capture note %}
- Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
  - This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8<sup>th</sup> character isn't valid.
- If `CastingLevel = 0`, then the action will use Caster Level.
{% endcapture %} {% include note.html %}
 */
declare function ForceSpell(target: ObjectPtr, spell: number): void;

/**
 * 
 */
declare function ForceSpellPointRES(res: string, target: Point): void;

/**
 * 
 */
declare function ForceSpellPointRES(res: string, target: Point, castinglevel: number): void;

/**
 * This action causes the active creature to cast the specified spell at the specified point ([x.y]). The spell need not currently be memorised by the caster, and will not be interrupted while being cast. The caster must meet the level requirements of the spell. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long.

```weidu-baf
  IF
    Global("AndrisBehavior","AR1009",0)
    See(NearestEnemyOf(Myself))
  THEN
    RESPONSE #100
      ForceSpellPoint([2002.1554],WIZARD_DIMENSION_DOOR)
      Wait(1)
      SpellNoDec(NearestEnemyOf(Myself),WIZARD_CONFUSION)
      SetGlobal("AndrisBehavior","AR1009",1)
  END
```

{% capture note %}
- Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
  - This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8<sup>th</sup> character isn't valid.
- If `CastingLevel = 0`, then the action will use Caster Level.
{% endcapture %} {% include note.html %}
 */
declare function ForceSpellPoint(target: Point, spell: number): void;

/**
 * This action sets a global timer. The timer is checked by the GlobalTimerExpired trigger or GlobalTimerNotExpired trigger.

```weidu-baf
  IF
    GlobalTimerExpired("Areana","GLOBAL")
    !Exists("TorLobo")
    !Dead("TorLobo")
  THEN
    RESPONSE #100
      ActionOverride("Areana",DestroySelf())
      CreateCreature("TORLOB",[349.474],0)
  END
```
 */
declare function SetGlobalTimer(name: string, area: string, time: number): void;

/**
 * This action takes a single instance of the specified item from the party (unless the item exists in a stack, in which case the entire stack is taken). Characters are checked in current party order. The item is transferred to the inventory of the active creature. If there are multiple calls to TakePartyItem() in the same block, each with the same item specified, only one call will actually remove an item (on each execution of the block). If an item is found in a container on an earlier player and in the inventory of a later player, both item instances may be removed. All slots are checked; inventory slots are checked in the following order

```weidu-baf
  0, 2, 4, 6, 8, 10, 12, 14
  1, 3, 5, 7, 9, 11, 13, 15
```

The example is from AR0516.bcs.

```weidu-baf
  IF
    Global("ThrallOrb","GLOBAL",2)
    PartyHasItem("MISC7Y")
  THEN
    RESPONSE #100
      TakePartyItem("MISC7Y")
  END
```
 */
declare function TakePartyItem(item: string): void;

/**
 * This action takes the specified amount of gold from the party. If performed by a party member, the gold is transferred to that characters gold stat (in the CRE file) and re-added to the party pot when the character re-joins the party.
The example script is from AR0602.bcs.

```weidu-baf
  IF
    Global("TakeImportItems","AR0602",0)
  THEN
    RESPONSE #100
      SetGlobal("TakeImportItems","AR0602",1)
      SetGlobal("Chapter","GLOBAL",1)
      ActionOverride("Malaaq",MoveBetweenAreas("AR0601",[345.591],14))
      ActionOverride("DuegarClanChief",TakeItemListPartyNum("IMPORT01",1))
      ActionOverride("Shelf1",TakeItemListPartyNum("IMPORT03";,1))
      SmallWait(4)
      TakePartyGold(2147483647)
  (cut short for brevity)
```
 */
declare function TakePartyGold(amount: number): void;

/**
 * This action gives the specified amount of gold to the party. The active creature must have the gold in its "money variable".

```weidu-baf
  IF
    G("KRGIVEGOLD",0)
  THEN
    RESPONSE #100
      GivePartyGold(500)
      SG("KRGIVEGOLD",1)
  END
```
 */
declare function GivePartyGold(amount: number): void;

/**
 * This action causes the active creature to drop all its inventory items. The example script is from the cutscene with Mazzy fighting the ogre; cut16a.bcs.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      CutSceneId(Player1)
      FadeToColor([20.0],0)
      Wait(1)
      ActionOverride("mazzy",DropInventory())
      Wait(2)
  (cut short for brevity)
```
 */
declare function DropInventory(): void;

/**
 * This action starts a cutscene; a cinematic sequence that removes the GUI and player control. The cutscene parameter is the script name to run.
The second variant can enable condition checking (trigger evaluation, off by default) when the second parameter is set to TRUE.

The example script is from cutscene BDCUT17B.bcs and shows how they can be reused. With `StartCutSceneEx("BDCUT17B",TRUE)` it executes
only one script block depending on the specified conditions. With `StartCutSceneEx("BDCUT17B",FALSE)` it will execute both blocks
regardless of condition.

```weidu-baf
  IF
    GlobalLT("bd_cut17b_cycle","bd1000",10)
    !NearLocation(Player1,4535,550,30)
  THEN
    RESPONSE #100
      CutSceneId("bdcutid")
      IncrementGlobal("bd_cut17b_cycle","bd1000",1)
      Wait(1)
      StartCutSceneEx("bdcut17b",TRUE)
  END
  
  IF
    OR(2)
      GlobalGT("bd_cut17b_cycle","bd1000",9)
      NearLocation(Player1,4535,550,30)
  THEN
    RESPONSE #100
      CutSceneId("bdcutid")
      SmallWait(10)
      SetCutSceneBreakable(FALSE)
      SetGlobal("BD_CUTSCENE_BREAKABLE","GLOBAL",0)
      SetAreaScript("",OVERRIDE)
      SmallWait(5)
      SetGlobalTimer("bd_mdd016b_timer","bd1000",TWO_ROUNDS)
      ActionOverride("bdcaelar",StartDialogNoSet(Player1))
  END
```
 */
declare function StartCutScene(cutscene: string): void;

/**
 * This action starts a cutscene. Player control is removed, and scripts stop running. Note that actions already in the action list are not cleared without an explicit call to ClearAllActions. The example script is from are0507.bcs.

```weidu-baf
  IF
    Global("AmsiHouse","GLOBAL",3)
    !Dead("amsi")
  THEN
    RESPONSE #100
      ClearAllActions()
      StartCutSceneMode()
      ActionOverride("amsi",StartDialogueNoSet(Player1))
  END
```
 */
declare function StartCutSceneMode(): void;

/**
 * This action ends a cutscene, and restores the GUI and player control. The example script is from ar0800.bcs.

```weidu-baf
  IF
    GlobalGT("BodhiJob","GLOBAL",0)
    Global("Movie02","GLOBAL",0)
  THEN
    RESPONSE #100
      ClearAllActions()
      SetGlobal("Movie02","GLOBAL",1)
      StartCutSceneMode()
      FadeToColor([30.0],0)
      Wait(2)
      EndCutSceneMode()
      TextScreen("SCENE04")
      SmallWait(1)
      StartCutSceneMode()
      StartCutScene("Movie02a")
  END
```
 */
declare function EndCutSceneMode(): void;

/**
 * This action clears any queued actions for all creatures in the area. The example script is from ar0507.bcs.

```weidu-baf
  IF
    Global("AmsiHouse","GLOBAL",3)
    !Dead("amsi")
  THEN
    RESPONSE #100
      ClearAllActions()
      StartCutSceneMode()
      ActionOverride("amsi",StartDialogueNoSet(Player1))
  END
```
 */
declare function ClearAllActions(): void;

/**
 * This action deactivates the target creature. The creature remains in the area, but is removed from play - i.e. it is invisible and cannot be interacted with.
 */
declare function Deactivate(object: ObjectPtr): void;

/**
 * This action activates the target creature. The creature is returned to play - i.e. it is visible and can be interacted with.
 */
declare function Activate(object: ObjectPtr): void;

/**
 * This action is used internally in a cutscene to make the object with the specified death variable perform actions. The action appears to only work from a creature script. The example script is from cut01.bcs.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      CutSceneId(Player1)
      LeaveAreaLUAPanic("AR0700","",[2753.868],4)
      LeaveAreaLUA("AR0700","",[2753.868],4)
  (cut short for brevity)
```
 */
declare function CutSceneId(object: ObjectPtr): void;

/**
 * This action is likely called directly by the engine, and is used to give ankegs give the appearance of emerging from the ground. Calling the action from script has no effect.
 */
declare function AnkhegEmerge(): void;

/**
 * This action is likely called directly by the engine, and is used to give ankegs give the appearance of burrowing into the ground. Calling the action from script has no effect.
 */
declare function AnkhegHide(): void;

/**
 * This action instructs the active creature to enter Detect Traps modal state. This action can be used for any creature (not just thieves) though success in detecting traps is dependent on points in the Find Traps skill.

```weidu-baf
  IF
    ActionListEmpty()
    !Exists([EVILCUTOFF])
    !ModalState( Myself,DETECTTRAPS)
    OR(2)
    !StateCheck(Myself,STATE_INVISIBLE)
    !StateChe ck(Myself,STATE_IMPROVEDINVISIBILITY)
  THEN
    RESPONSE #100
      FindTraps()
  END
```
 */
declare function FindTraps(): void;

/**
 * This action causes the active creature to turn in a random direction. The example script is from waitturn.bcs.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      RandomTurn()
  END
```

{% capture note %}
* This action will never stop, (unless interrupted in specific situations), and thus never leave the action list.
* Executes [Wait()](#63) for a random amount of time, (1–40 seconds), if the creature goes off-screen.
* Waits 1–10 seconds between each evaluation.

{% endcapture %} {% include note.html %}
 */
declare function RandomTurn(): void;

/**
 * This action causes the target creature to die, dropping any droppable items they are carrying.

```weidu-baf
  IF
    Global("KillArntra04","AR0307",1)
  THEN
    RESPONSE #100
      SetGlobal("KillArntra04","AR0307",2)
      ActionOverride("arntra04",Face(10))
      Wait(1)
      ForceSpell("arntra04",CLERIC_FLAME_STRIKE)
      Wait(1)
      Kill("arntra04")
      CreateCreature("Arntra05",[3213.485],0)
  END
```
 */
declare function Kill(object: ObjectPtr): void;

/**
 * This action plays a sound linked to the object.

```weidu-baf
  IF
    Delay(2)
    HPPercentLT(Myself,35)
  THEN
    RESPONSE #95
      Shout(HURT)
      Continue()
    RESPONSE #5
      VerbalConstant(Myself,HURT)
      Shout(HURT)
      Continue()
  END
```
 */
declare function VerbalConstant(object: ObjectPtr, constant: number): void;

/**
 * This action clears the action list of the specified object (including ModalActions). The example script is from ar2400.bcs.

```weidu-baf
  IF
    GlobalTimerExpired("udWaitOgreDoor","GLOBAL")
    Global("HaveOgreOpenDoor","AR2400",0)
    Global("udGithDead","AR2400",0)
    !Global("udMind","GLOBAL",30)
  THEN
    RESPONSE #100
      SetInterrupt(FALSE)
      SetGlobal("HaveOgreOpenDoor","AR2400",1)
      ClearActions(Player1)
      ClearActions(Player2)
      ClearActions(Player3)
      ClearActions(Player4)
      ClearActions(Player5)
      ClearActions(Player6)
      SetInterrupt(TRUE)
      StartCutSceneMode()
      StartCutScene("Cut44i")
  END
```
 */
declare function ClearActions(object: ObjectPtr): void;

/**
 * This action instructs the active creature to attack the target for the specified time (ReevaluationPeriod) which is measured in AI updates (which default to 15 per second).The script will then run again, checking for other true conditions.

```weidu-baf
  IF
    See([EVILCUTOFF])
    Range(LastSeenBy(),4)
    !InParty(LastSeenBy())
    !Allegiance(LastSeenBy(Myself),GOODCUTOFF)
    !Class(LastSeenBy(Myself),INNOCENT)
    InWeaponRange(LastSeenBy())
    HasWeaponEquiped()
  THEN
    RESPONSE #100
      AttackReevaluate(LastSeenBy(),30)
  END
```
 */
declare function AttackReevaluate(target: ObjectPtr, reevaluationperiod: number): void;

/**
 * This action locks the screen on the active creature, preventing the screen from being scrolled away. The action only works when executed by a creature (its own script or via `ActionOverride`).

```weidu-baf
  IF
    CombatCounter(0)
  THEN
    RESPONSE #100
      LockScroll()
  END
```
 */
declare function LockScroll(): void;

/**
 * This action unlocks the screen if it has been locked.

```weidu-baf
  IF
    OR(2)
    HotKey(H)
    !CombatCounter(0)
  THEN
    RESPONSE #100
      UnlockScroll()
  END
```
 */
declare function UnlockScroll(): void;

/**
 * 
 */
declare function StartDialogue(dialogfile: string, target: ObjectPtr): void;

/**
 * This action instructs the active creature to start the specified dialog with the specified target. The dialog can be initiated from a distance and must have at least one state with all its top level conditions true else it will not initiate. The active creature has its dialog file permanently set to the file specified by the DialogFile parameter.

```weidu-baf
  IF
    See([PC])
    NumTimesTalkedTo(0)
  THEN
    RESPONSE #100
      StartDialog("andris",[PC])
  END
```
 */
declare function StartDialog(dialogfile: string, target: ObjectPtr): void;

/**
 * 
 */
declare function SetDialogue(dialogfile: string): void;

/**
 * This action sets the dialog file of the active creature to the specified file. SetDialogue("") will set the dialog file to nothing.

```weidu-baf
  IF
    AttackedBy([GOODCUTOFF],DEFAULT)
    Global("KR_CHANGE_DIALOG","LOCALS",0)
  THEN
    RESPONSE #100
      SetDialogue("")
      SetGlobal("KR_CHANGE_DIALOG","LOCALS",1)
  END
```
 */
declare function SetDialog(dialogfile: string): void;

/**
 * 
 */
declare function PlayerDialogue(target: ObjectPtr): void;

/**
 * This action instructs the active creature to start a dialog with the target creature, from any distance. If the target is invalid, no action will be taken.
 */
declare function PlayerDialog(target: ObjectPtr): void;

/**
 * This action creates the item specified by the resref parameter on the creature specified by the object parameter, with quantity/charges controlled by the usage parameters.

```weidu-baf
  IF
    GlobalTimerExpired("dwVith","GLOBAL")
    Global("dwVithal","GLOBAL",3)
  THEN
    RESPONSE #100
      CreateVisualEffectObject("SPPLANAR","udvith")
      Wait(2)
      Activate("udvith")
      GiveItemCreate("scrl8z","udvith",1,1,0)
      GiveItemCreate("scrl9g","udvith",1,1,0)
      GiveItemCreate("scrl9e","udvith",1,1,0)
      GiveItemCreate("scrl9v","udvith",1,1,0)
      GiveItemCreate("scrl9r","udvith",1,1,0)
      SetGlobal("dwVithal","GLOBAL",4)
  END
```
 */
declare function GiveItemCreate(resref: string, object: ObjectPtr, usage1: number, usage2: number, usage3: number): void;

/**
 * This action gives the party a sum of gold corresponding to the given global variable. The gold amount is deducted from the active creature. The example script will give the party 50gp.
```weidu-baf
  IF
    Global("Cash","GLOBAL",50)
  THEN
    RESPONSE #100
      GivePartyGoldGlobal("Cash","GLOBAL")
  END
```
 */
declare function GivePartyGoldGlobal(name: string, area: string): void;

/**
 * This action is used by the engine internally. An object id is expected in the in1 parameter.
 */
declare function UseDoor(): void;

/**
 * This action will open the specified door. If the door is locked the creature must possess the correct key. Some doors central to the plot doors cannot be opened. The active creature can stick on this action if it fails.

```weidu-baf
  IF
    See("Door01"
    OpenState("Door01",FALSE)
    !See([GOODCUTOFF])
    !TargetUnreachable("Door01")
  THEN
    RESPONSE #100
      MoveToObjectNoInterrupt("Door01")
      Unlock("Door01" )
      OpenDoor("Door01")
  END
```
 */
declare function OpenDoor(object: ObjectPtr): void;

/**
 * This action closes the specified door. The example script is from ar0300.bcs.

```weidu-baf
  IF
    OR(2)
    Global("LyrosJob","GLOBAL",3)
    Dead("lyros")
    Exists("Rylock")
    Global("RylockLeavesHarperDoor","AR0300",0)
  THEN
    RESPONSE #100
      SetGlobal("RylockLeavesHarperDoor","AR0300",1)
      CloseDoor("DOOR0308")
      Lock("DOOR0308")
      ActionOverride("Rylock",EscapeArea())
  END
```
 */
declare function CloseDoor(object: ObjectPtr): void;

/**
 * This action instructs the active <a href="../../file_formats/ie_formats/cre_v1.htm">creature</a> to attempt to pick the lock of the specified object. This action can be used for any creature (not just thieves) though success in picking the lock depends on points in the <code><a href="../../file_formats/ie_formats/cre_v1.htm#CREV1_0_Header_0x67">Open Locks</a></code> skill.
 */
declare function PickLock(object: ObjectPtr): void;

/**
 * This action causes the active creature to change animation to the specified animation (values from [animate.ids]({{ ids }}/animate.htm))

```weidu-baf
  IF
    !InPartyAllowDead("Aerie")
    !Dead("Aerie")
    !GlobalGT("AerieTransform","GLOBAL",0)
    Global("Aerie","AR0607",0)
    Global("KalahI","AR0607",0)
  THEN
    RESPONSE #100
      MoveGlobal("Ar0607","Aerie",[318.378])
      ChangeEnemyAlly("Aerie",NEUTRAL)
      SetGlobal("Aerie","AR0607",1)
      ActionOverride("Aerie",Polymorph(MAGE_FEMALE_ELF))
      ActionOverride("Aerie",SetBeenInPartyFlags())
      SetGlobal("AerieTransform","GLOBAL",2)
  END
```
 */
declare function Polymorph(animationtype: number): void;

/**
 * 
 */
declare function RemoveSpellRES(res: string): void;

/**
 * This action removes one memorised indtance of the specified spell from the spellbook of the active creature. The spell can be an innate ability, a priest spell or a wizard spell, but must be listed in [spell.ids]({{ ids }}/spell.htm).

```weidu-baf
  IF
    Global("KR_ANTI_PALADIN_CHANGE","LOCALS",1)
  THEN
    RESPONSE #100
      RemoveSpell(PALADIN_LAY_ON_HANDS)
      RemoveSpell(PALADIN_DETECT_EVIL)
      RemoveSpell(PALADIN_PROTECTION_FROM_EVIL)
      SetGlobal("KR_ANTI_PALADIN_CHANGE","LOCALS",2)
  END
```

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8<sup>th</sup> character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function RemoveSpell(spell: number): void;

/**
 * This action is miscoded in the default action.ids file (the number 0 should be the capital letter O). When corrected, this action causes the active creature to attempt to bash the specified door.
 */
declare function BashDoor(object: 0): void;

/**
 * This action instructs the active creature to equip the most damaging melee weapon from those available in the quickslots. Damage is calculated on the THAC0 bonus and damage - special bonuses versus creature types and elemental damages are not checked.

```weidu-baf
  IF
    See([EVILCUTOFF])
  THEN
    RESPONSE #100
      EquipMostDamagingMelee()
      Attack([EVILCUTOFF])
  END
```
 */
declare function EquipMostDamagingMelee(): void;

/**
 * This action instructs the active creature to give the specified item (parameter 1) to the specified target (parameter 2). The active creature must possess the item to pass it (holding it within a container within the inventory is fine). The sample script makes uses of modified IDS files (action, instant, trigger and svtiobj) though such modification are not necessary to use the GiveItem action itself.

```weidu-baf
  IF
    HPPercentLT(Myself,40)
    !HasItem("potn52",Myself)
  THEN
    RESPONSE #100
      GlobalShout(3015)
      SetGlobal("KRNEEDITEM","GLOBAL",1)
  END
  
  IF
    Heard([GOODCUTOFF],3015)
    HasItem("potn52",Myself)
    HPPercentGT(Myself,40)
    Global("KRNEEDITEM","GLOBAL",1)
  THEN
    RESPONSE #100
      MoveToObject(LastHeardBy())
      GiveItem("potn52",LastHeardBy())
      SetGlobal("KRNEEDITEM","GLOBAL",0)
  END
```
 */
declare function GiveItem(object: string, target: ObjectPtr): void;

/**
 * This action starts the specified store with the specified object.

```weidu-baf
  IF
    Global("KRSTART_STORE","LOCALS",1)
  THEN
    RESPONSE #100
      StartStore("Tem4802",LastTalkedToBy())
  END
```
 */
declare function StartStore(store: string, target: ObjectPtr): void;

/**
 * This action displays the strref specified by the StrRef parameter in the message window, attributing the text to the specified object.

```weidu-baf
  IF
    HasItem("potn52",Myself)
    HPPercentLT((),50)
  THEN
    RESPONSE #100
      UseItem("potn52",Myself)
      DisplayString(Myself,46150)
  END
```
 */
declare function DisplayString(object: ObjectPtr, strref: number): void;

/**
 * This action changes the IDS identifiers for the active creature to the values specified. The object parameter must be in the IDS object form (i.e [EA.GENERAL.RACE.CLASS.SPECIFIC.GENDER.ALIGN]). If parameters are missing, they will default to 0. If a symbolic object is passed, all identifiers will be cleared and the IDS identifier bytes will be filled. ChangeAIType(NearestEnemyOf(LastSeenBy(LastTalkedToBy(LastTrigger())))) would zero Allegiance, General, Race, Class, Specific, Gender, and Alignment, set spec 1 to "Myself" (the [object.ids]({{ ids }}/object.htm) value, 1), 2 to LastTrigger, 3 to LastTalkedToBy, 4 to LastSeenBy, and 5 to NearestEnemyOf.
 */
declare function ChangeAIType(object: ObjectPtr): void;

/**
 * This action changes the EA status of the target creature to the specified value. Values are from [ea.ids]({{ ids }}/ea.htm).

```weidu-baf
  IF
    Global"KR_ENEMYALLY_CHANGE","LOCALS",0)
  THEN
    RESPONSE #100
     SetGlobal"KR_ENEMYALLY_CHANGE","LOCALS",1)
      ChangeEnemyAlly(Myself,NEUTRAL)
  END
```
 */
declare function ChangeEnemyAlly(object: ObjectPtr, value: number): void;

/**
 * This action changes the general status of the target creature to the specified value. Values are from [general.ids]({{ ids }}/general.htm).

```weidu-baf
  IF
    Global"KR_GENERAL_CHANGE","LOCALS" ,0)
  THEN
    RESPONSE #100
      SetGlobal"KR_GENERAL_CHANGE","LOCALS",1)
      ChangeGeneral(Myself,UNDEAD)
  END
```
 */
declare function ChangeGeneral(object: ObjectPtr, value: number): void;

/**
 * This action changes the race of the target creature to the specified value. Values are from [race.ids]({{ ids }}/race.htm).

```weidu-baf
  IF
    Global"KR_RACE_CHANGE","LOCALS",0)
  THEN
    RESPONSE #100
      SetGlobal"KR_RACE_CHANGE","LOCALS",1)
      ChangeRace(Myself,DRAGON)
  END
```
 */
declare function ChangeRace(object: ObjectPtr, value: number): void;

/**
 * This action changes the class of the target creature to the specified value. Values are from [class.ids]({{ ids }}/class.htm).

```weidu-baf
  IF
    Global"KR_CLASS_CHANGE","LOCALS",0)
  THEN
    RESPONSE #100
      SetGlobal"KR_CLASS_CHANGE","LOCALS",1)
      ChangeClass(Myself,FIGHTER)
  END
```
 */
declare function ChangeClass(object: ObjectPtr, value: number): void;

/**
 * This action changes the specific status of the target creature to the specified value. Values are from [specific.ids]({{ ids }}/specific.htm). The action produces inconsistent results when used on player characters in multiplayer games. The specific value is represented by one byte, and so is limited to values 0-255. The example script assigns a script to a newly created simulacrum.

```weidu-baf
  IF
    See([ALLY])
    !InParty(LastSeenBy(Myself))
    !Gender(LastSeenBy(Myself),SUMMONED)
    !General(LastSeenBy(Myself),ANIMAL)
    !General(LastSeenBy(Myself),MONSTER)
    !General(LastSeenBy(Myself),UNDEAD)
    !General(LastSeenBy (Myself),GIANTHUMANOID)
    !Race(LastSeenBy(Myself),ELEMENTAL)
    !Race(LastSeenBy(Myself),MEPHIT)
    !Race(LastSeenBy(Myself),IMP)
    !HasItem("IMOENHP1&q uot;,LastSeenBy(Myself))
    !HasItem("MINHP1",LastSeenBy(Myself))
    !Specifics(LastSeenBy(Myself),100)
  THEN
    RESPONSE #100
      DisplayStringHead(LastSeenBy(Myself),26234) // 'Simulacrum'
      ActionOverride(LastSeenBy(Myself), ChangeAIScript("gbSim&quot;,DEFAULT))
      ChangeSpecifics(LastSeenBy(Myself),100)
  END
```
 */
declare function ChangeSpecifics(object: ObjectPtr, value: number): void;

/**
 * This action changes the gender of the target creature to the specified value. Values are from [gender.ids]({{ ids }}/gender.htm). The example script changes the gender of summoned creatures to neither, to bypass the 5 concurrent summoned creatures limit.

```weidu-baf
  IF
    See([ALLY])
    !InParty(LastSeenBy(Myself))
    Gender(LastS eenBy(Myself),SUMMONED)
    !Specifics(LastSeenBy(Myself),3001)
  THEN
    RESPONSE #100
      ChangeGender(LastSeenBy(),NEITHER)
      ChangeSpecifics(LastSeenBy(Myself), 3001)
  END
```
 */
declare function ChangeGender(object: ObjectPtr, value: number): void;

/**
 * This action changes the alignment of the target creature to the specified value. Values are from [align.ids]({{ ids }}/align.htm).

```weidu-baf
  IF
    Global("KR_ALIGN_CHANGE","LOCALS",0)
  THEN
    RESPONSE #100
      SetGlobal("KR_ALIGN_CHANGE","LOCALS",1)
      ChangeAlignment(LastSeenBy(Myself),CHAOTIC_GOOD)
  END
```
 */
declare function ChangeAlignment(object: ObjectPtr, value: number): void;

/**
 * This action is used in conjunction with the ReceivedOrder trigger, and works in a similar way to a global shout. The action passes a numeric order to the specified creature. Only one creature at a time responds to an order, and creatures to not detect their own orders.

```weidu-baf
  IF
    See([EVILCUTOFF])
    OR(3)
    Class(Myself,FIGHTER_ALL)
    Class(Myself,RANGER_ALL)
    Class(Myse lf,PALADIN_ALL)
  THEN
    RESPONSE #100
      GiveOrder([PC.0.0.THIEF_ALL],100)
  END
  
  IF
    ReceivedOrder(Myself,100)
    Class(Myself,THIEF_ALL)
  THEN
    RESPONSE #100
      RunAwayFrom([EVILCUTOFF],120)
      Hide()
  END
```
 */
declare function GiveOrder(object: ObjectPtr, order: number): void;

/**
 * 
 */
declare function ApplySpellRES(res: string, target: ObjectPtr): void;

/**
 * This action causes the active creature to cast the specified spell at the target object. The spell is applied instantly; no casting animation is played. The spell cannot be interrupted. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long. Both actions apply the spell at the lowest casting level (they will even use a level `0` ability if the spell has one, which other actions cannot do) and ignore its projectile (i.e. they use projectile `#1|None`) - the casting level of the originating creature is ignored. Note that for normal spellcasting the probability dice values for effects are rolled for each spell, whereas spells applied in the same scripting block by `ApplySpell` use a single dice value. The example script is used to mimic a contingency from `"mage18y.bcs"`.

```weidu-baf
  IF
    See(NearestEnemyOf(Myself))
    Global("Prep","LOCALS",0)
  THEN
    RESPONSE #100
      ApplySpell(Myself,WIZARD_STONE_SKIN)
      ApplySpell(Myself,WIZARD_SPELL_TRAP)
      ApplySpell(Myself,WIZARD_MIRROR_IMAGE)
      ApplySpell(Myself,WIZARD_SPELL_TURNING)
      ApplySpell(Myself,WIZARD_PROTECTION_FROM_MAGIC_WEAPONS)
      ApplySpell(SixthNearestEnemyOf(Myself),WIZARD_MONSTER_SUMMONING_4)
      SetGlobal("Prep","LOCALS",1)
  END
```

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8<sup>th</sup> character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function ApplySpell(target: ObjectPtr, spell: number): void;

/**
 * This action is used to increment the chapter, and display a text screen (specified by the resref parameter - a 2DA file). The example script is from ar1803.bcs.

```weidu-baf
  IF
    Dead("Davaeorn")
    Global("Chapter","GLOBAL",4)
  THEN
    RESPONSE #100
      RevealAreaOnMap("AR0900")
      IncrementChapter("Chptxt5")
      AddJournalEntry(15839,USER)
  END
```
 */
declare function IncrementChapter(resref: string): void;

/**
 * This action sets the reputation to the specified value.
```weidu-baf
  IF
    Global("KRGOODDEED","GLOBAL",0)
  THEN
    RESPONSE #100
      ReputationSet(20)
      SG("KRGOODDEED",1)
  END
```
 */
declare function ReputationSet(reputation: number): void;

/**
 * This action alters the reputation by the specified value (which can be either negative or positive). The example script is from baldur.bcs.

```weidu-baf
  IF
    InParty("Viconia")
    Global("ViconiaJoinedParty","GLOBAL",0)
  THEN
    RESPONSE #100
      ReputationInc(-2)
      SetGlobal("ViconiaJoinedParty","GLOBAL",1)
  END
```
 */
declare function ReputationInc(reputation: number): void;

/**
 * This action gives (or takes if negative) the specified amount of experience to the party. The XP amount is distributed among all current living party members. The example script is from ar1300.bcs.
```weidu-baf
  IF
    OpenState("Bridge01",TRUE)
    Global("BridgeOpen","GLOBAL",0)
    !Dead("Torgal")
  THEN
    RESPONSE #100
    SetGlobal("BridgeOpen","GLOBAL",1)
    DisplayString(Myself,'The drawbridge has been lowered.')
    CreateCreature("KPCAPT03",[2400.1592],6)
    CreateCreature("KPSOLD03",[2425.1676],6)
    CreateCreature("KPSOLD04",[2371.1754],6)
    CreateCreature("KPSOLD05",[2315.1805],6)
    CreateCreature("TROLGI01",[2391.1592],0)
    CreateCreature("TROLGI02",[2282.1742],0)
    CreateCreature("KPYUAN01",[2251.1731],0)
    AddexperienceParty(29750)
  (cut short for brevity)
```
 */
declare function AddExperienceParty(xp: number): void;

/**
 * This action adds experience to the party, with the amount corresponding to a global variable.

```weidu-baf
  IF
    Global("MyXP","GLOBAL",0)
  THEN
    RESPONSE #100
      SetGlobal("MyXP","GLOBAL",50)
      AddExperiencePartyGlobal("MyXP","GLOBAL")
  END
```
 */
declare function AddExperiencePartyGlobal(name: string, area: string): void;

/**
 * This action sets the number of times the active creature has been talked to (by player characters). The example script is from ar0103.bcs.

```weidu-baf
  IF
    Global("BrielbaraMove","GLOBAL",1)
    !Exists("Brielbara")
    !Dead("Brielbara")
  THEN
    RESPONSE #100
      CreateCreature("BRIELB",[418.376],0)
      ActionOverride("Brielbara",SetNumTimesTalkedTo(1))
  END
```
 */
declare function SetNumTimesTalkedTo(num: number): void;

/**
 * This action is used to a play a movie (MVE file). The example script is from ar108.bcs.

```weidu-baf
  IF
    Global("EnteredPalace","GLOBAL",0)
  THEN
    RESPONSE #100
      StartMovie("PALACE")
      SetGlobal("EnteredPalace","GLOBAL",1)
  END
```
 */
declare function StartMovie(resref: string): void;

/**
 * This action is used to initiate banter between NPCs. The example script is from edwin.bcs.

```weidu-baf
  IF
    InParty(Myself)
    Gender(Myself,FEMALE)
    InParty("Aerie")
    See("Aerie")
    !Dead("Aerie")
    !StateCheck("Aerie",STATE_SLEEPING)
    Range("Aerie",10)
    CombatCounter(0)
    !Range(SecondNearest([PC]),10)
    Global("EdwinW1","LOCALS",0)
  THEN
    RESPONSE #100
      Interact("Aerie")
  END
```
 */
declare function Interact(object: ObjectPtr): void;

/**
 * This action removes a single instance of the specified item from the active creature, unless the item exists in a stack, in which case the entire stack is removed. The example script is from ar1000.bcs.

```weidu-baf
  IF
    Global("CerndBaby","GLOBAL",1)
    Global("CerndBabyTake","AR1000",0)
  THEN
    RESPONSE #100
      SetGlobal("CerndBabyTake","AR1000",1)
      TakePartyItem("misc8t")
      DestroyItem("misc8t")
  END
```
 */
declare function DestroyItem(resref: string): void;

/**
 * This action reveals an area on the worldmap, enabling travelling to it.

```weidu-baf
  IF
    Dead("Davaeorn")
    Global("Chapter","GLOBAL",4)
  THEN
    RESPONSE #100
      RevealAreaOnMap("AR0900")
      IncrementChapter("Chptxt5")
      AddJournalEntry(15839,USER)
  END
```
 */
declare function RevealAreaOnMap(resref: string): void;

/**
 * This action gives the specified amount of gold to the party. The active creature need not have the gold in its "money variable". A negative amount will remove gold from the active creature.

```weidu-baf
  IF
    NumTimesTalkedTo(30)
  THEN
    RESPONSE #100
      SetNumTimesTalkedTo(31)
      GiveGoldForce(300)
  END
```
 */
declare function GiveGoldForce(amount: number): void;

/**
 * This action sets the open/closed graphic of a tile in a WED file.
 */
declare function ChangeTileState(tile: ObjectPtr, state: number): void;

/**
 * This action adds an entry into the journal. The entry parameter is the strref to add, and the JourType is the type of entry (i.e. the location within the journal to add the entry to) - values are from [jourtype.ids]({{ ids }}/jourtype.htm). The example script is from ar0511.bcs.

```weidu-baf
  IF
    Dead("JanGith1")
    Dead("JanGith2")
    Global("ThumbSeeker","GLOBAL",2)
    Global("HiddenJournal","AR0511",0)
  THEN
    RESPONSE #100
      SetGlobal("HiddenJournal","AR0511",1)
      AddJournalEntry(34726,QUEST)
  END
```
 */
declare function AddJournalEntry(entry: number, type: number): void;

/**
 * This action instructs the active creature to a ranged weapon from the weapons available in the quickslots.

```weidu-baf
  IF
    See([EVILCUTOFF])
    !Range([EVILCUTOFF],4)
    OR(28)
      !HasItemEquiped("Bow01",())
      !HasItemEquiped("Bow02",())
      !HasItemEquiped("Bow03",())
      !HasItemEquiped("Bow04",())
      !HasItemEquipedReal("Bow05",())
      !HasItemEquipedReal("Bow06",())
      !HasItemEquipedReal("Bow07",())
      !HasItemEquipedReal("Bow08",())
      !HasItemEquipedReal("Bow09",())
      !HasItemEquipedReal("Bow10",())
      !HasItemEquipedReal("Bow11",())
      !HasItemEquipedReal("Bow12",())
      !HasItemEquipedReal("Bow13",())
      !HasItemEquipedReal("Bow14",())
      !HasItemEquipedReal("Bow15",())
      !HasItemEquipedReal("Bow16",())
      !HasItemEquipedReal("Bow17",())
      !HasItemEquipedReal("Bow18",())
      !HasItemEquipedReal("Bow19",())
      !HasItemEquipedReal("Bow20",())
      !HasItemEquipedReal("Bow21",())
      !HasItemEquipedReal("Bow22",())
      !HasItemEquipedReal("Bow23",())
      !HasItemEquipedReal("Bow24",())
      !HasItemEquipedReal("Bow25",())
      !HasItemEquipedReal("Bow26",())
      !HasItemEquipedReal("Bow98",())
      !HasItemEquipedReal("Bow99",())
  THEN
    RESPONSE #100
      EquipRanged()
      AttackReevaluate([EVILCUTOFF],30)
  END
```
 */
declare function EquipRanged(): void;

/**
 * 
 */
declare function SetLeavePartyDialogueFile(): void;

/**
 * This action sets the dialog for the active creature to their leave dialog.

```weidu-baf
  IF
    !InParty(Myself)
    HPGT(Myself,0)
  THEN
    RESPONSE #100
      SetLeavePartyDialogFile()
      Dialogue(Player1)
      ChangeAIScript("",DEFAULT)
  END
```
 */
declare function SetLeavePartyDialogFile(): void;

/**
 * This action instructs the active creature to search for the nearest travel trigger point for the specified time (measured in second) before giving up and just disappearing.
 */
declare function EscapeAreaDestroy(delay: number): void;

/**
 * This action is used in conjunction with trigger region in ARE files. The action sets the activation state a trigger region (specified by the object parameter).
 */
declare function TriggerActivation(object: ObjectPtr, state: number): void;

/**
 * 
 */
declare function DialogueInterrupt(state: number): void;

/**
 * This action sets the interrupt state of the active creature. When set to false the creature cannot receive dialog requests or issue verbal constants. The interrupt state of a creature is not saved.
 */
declare function DialogInterrupt(state: number): void;

/**
 * This action instructs the active creature to attempt to Hide in Shadows. This action can be used for any creature (not just thieves) though success in hiding is dependent on points in the Stealth skill. A hidden creature is treated as STATE\_INVISIBLE.

```weidu-baf
  IF
    !See([EVILCUTOFF])
    OR(2)
    !StateCheck(Myself,STATE_INVISIBLE)
    !StateCheck(Myself,STATE_IMPROVEDINVISIBLITY)
  THEN
    RESPONSE #100
      Hide()
  END
```
 */
declare function Hide(): void;

/**
 * This action instructs the active creature to move to the specified object. Once the active creature reaches the object, it will follow the target if it moves. This behaviour continues until a different action is issued or until the target creature travels between areas.
 */
declare function MoveToObjectFollow(object: ObjectPtr): void;

/**
 * 
 */
declare function ReallyForceSpellRES(res: string, target: ObjectPtr): void;

/**
 * This action causes the active creature to cast the specified spell at the target object. The spell need not currently be memorised by the caster, and will not be interrupted while being cast. The spell is cast instantly (i.e. with a casting time of 0). The caster must meet the level requirements of the spell. This action does not work in the script round where the active creature has died.

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8th character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function ReallyForceSpell(target: ObjectPtr, spell: number): void;

/**
 * This action changes the active creature's selection circle to purple - making it unselectable. Creatures made unselectable stop processing scripts.
 */
declare function MakeUnselectable(time: number): void;

/**
 * This action is used in multiplayer games to ensure that players are at the same point before continuing.
 */
declare function MultiPlayerSync(): void;

/**
 * This action causes the active creature to run away from the specified creature, for the specified time. The time parameter is measured in AI updates, which default to 15 updates per second. Occasionally, fleeing creatures stop to attack another creature. Conditions are not checked until the time has expired.
 */
declare function RunAwayFromNoInterrupt(creature: ObjectPtr, time: number): void;

/**
 * This action adds the specified area to the top of the area script processing stack. When the player enters an area that is not in the mastarea.2da the associated script is added to the bottom of the area script processing stack. When the player enters an area that is in mastarea.2da the associated script is added to the top of the area script processing stack.
 */
declare function SetMasterArea(name: string): void;

/**
 * This action shows the ending credits.
 */
declare function EndCredits(): void;

/**
 * This action starts playing a music track. The slot parameter refers to the music slots contained in the ARE header. The flags parameter indicates how the music should be played - values are from [mflags.ids]({{ ids }}/mflags.htm).
 */
declare function StartMusic(slot: number, flags: number): void;

/**
 * This action removes all instances of the specified item from the party. The items are placed in the inventory of the active creature. Items contained in containers (e.g. Bag of Holding) are not taken.
 */
declare function TakePartyItemAll(item: string): void;

/**
 * This multiplayer-only action changes the current area. Parchment is the MOS image to use in the area transition loading screen. Only EE games support IDS symbols for `Face`.
 */
declare function LeaveAreaLUAPanic(area: string, parchment: string, point: Point, face: number): void;

/**
 * This action adds the active creature to the party. If the party is currently full the 'select party members' dialog is shown. JoinParty clears the ActionQueue of the active creature.

```weidu-baf
  IF
    See([PC])
    Global("KRJOINPARTY","GLOBAL",0)
  THEN
    RESPONSE #100
      JoinParty()
  END
```
 */
declare function JoinParty(): void;

/**
 * This action saves the game in the specified save slot.
 */
declare function SaveGame(slot: number): void;

/**
 * 
 */
declare function SpellNoDecRES(res: string, target: ObjectPtr): void;

/**
 * This action causes the active creature to cast the specified spell at the target object. The spell need not be currently be memorised by the caster, and may be interrupted while being cast. The caster must meet the level requirements of the spell. The spell will not be removed from the casters memory after casting. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long.

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8th character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function SpellNoDec(target: ObjectPtr, spell: number): void;

/**
 * 
 */
declare function SpellPointNoDecRES(res: string, target: Point): void;

/**
 * This action causes the active creature to cast the specified spell at the specified point (`[x.y]`). The spell must currently be memorised by the caster, and may be interrupted while being cast. The caster must meet the level requirements of the spell. The spell will be removed from the casters memory. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long. The example script is from `"andris.bcs"`.

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8th character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function SpellPointNoDec(target: Point, spell: number): void;

/**
 * This action instructs the active creature to take the specified item from the party, if they are nearby. A range for the action cannot be specified.
 */
declare function TakePartyItemRange(item: string): void;

/**
 * This action will change the animation of the active creature to match that of the specified CRE file. If the active creature is in the party, the action will create the specified creature.
 */
declare function ChangeAnimation(resref: string): void;

/**
 * This action will lock the specified door/container.
 */
declare function Lock(object: ObjectPtr): void;

/**
 * This action will unlock the specified door/container.
 */
declare function Unlock(object: ObjectPtr): void;

/**
 * This action will move the specified object to the target area, at the indicated point. The action will only work for creatures in the GAM file - i.e. NPCs or that have been added via MakeGlobal.
 */
declare function MoveGlobal(area: string, object: ObjectPtr, point: Point): void;

/**
 * 
 */
declare function StartDialogNoSet(object: ObjectPtr): void;

/**
 * This action instructs the active creature to initiate dialog with the target object, using its currently assigned dialog file. This action can be used from a distance and will work whether the target creature is in sight or not. Dialog will not be initiated if the creature using this action has been assigned a dialog that has all top level conditions returning false. If the target is invalid, the active creature will initiate dialog with Player1.
 */
declare function StartDialogueNoSet(object: ObjectPtr): void;

/**
 * This action displays a textscreen, showing text and graphics from the specified 2DA file.
 */
declare function TextScreen(textlist: string): void;

/**
 * This action causes the active creature to walk randomly, without pausing.

{% capture note %}
It is the same as [RandomWalk()](#85), just with the offscreen-wait removed and no [RandomTurn()](#130) chance.
{% endcapture %} {% include note.html %}
 */
declare function RandomWalkContinuous(): void;

/**
 * This action will highlight the specified secret door in purple, to indicate it has been detected.
 */
declare function DetectSecretDoor(object: ObjectPtr): void;

/**
 * This action will fade the screen. The point parameter is given in [x.y] format with the x coordinate specifying the number of AI updates (which default to 15 per second) to take to complete the fade action.
 */
declare function FadeToColor(point: Point, blue: number): void;

/**
 * This action will unfade the screen. The point parameter is given in [x.y] format with the x coordinate specifying the number of AI updates (which default to 15 per second) to take to complete the fade action.
 */
declare function FadeFromColor(point: Point, blue: number): void;

/**
 * This action will remove a number of instances (specified by the Num parameter) of the specified item from the party. The items will be removed from players in order, for example; Player1 has 3 instances of "MYITEM" in their inventory, Player2 has 2 instance of "MYITEM," and Player3 has 1 instance. If the action TakePartyItemNum("MYITEM", 4) is run, all 3 instances of "MYITEM" will be taken from Player1, and 1 instance will be taken from Player2. This leaves Player2 and Player3 each with one instance of "MYITEM." If the last item of an item type stored in a container STO file is removed by this action, the amount becomes zero. Items with zero quantities cannot be seen in-game, cannot be removed by TakePartyItem, and will not count toward a container's current item load. If the item to be taken is in a stack, and the stack is in a quickslot, the item will be removed, and the remaining stack will be placed in the inventory. If the inventory is full, the stack item will be dropped on the ground.
 */
declare function TakePartyItemNum(resref: string, num: number): void;

/**
 * This action functions the same as Wait.
 */
declare function WaitWait(time: number): void;

/**
 * This action causes the active creature to move to the specified coordinates. The action will update the position of creatures as stored in ARE files (first by setting the coordinates of the destination point, then by setting the coordinates of the current point once the destination is reached). Conditions are not checked until the destination point is reached.
 */
declare function MoveToPointNoInterrupt(point: Point): void;

/**
 * This action instructs the active creature to move to the specified object. The action does not update the current position of the actor, saved in ARE files. Conditions are not checked until the destination point is reached.
 */
declare function MoveToObjectNoInterrupt(object: ObjectPtr): void;

/**
 * As it says, this action will activate a spawn point in an area. The Object should be the name of the spawn point as written in the ARE file.
 */
declare function SpawnPtActivate(object: ObjectPtr): void;

/**
 * This action causes the active creature to leave the party. This action calls DropInventory() as part of its execution.

```weidu-baf
  IF
    HappinessLT(Myself,-299)
  THEN
    RESPONSE #100
      ChangeAIScript("",DEFAULT)
      SetLeavePartyDialogFile()
      LeaveParty()
      EscapeArea()
  END
```
 */
declare function LeaveParty(): void;

/**
 * This action is used in conjunction with spawn points in ARE files. The action sets the enabled state of a spawn point (specified by the object parameter).
 */
declare function SpawnPtDeactivate(object: ObjectPtr): void;

/**
 * This action causes an activated spawn point to spawn creatures, regardless of whether the time for spawning has expired. The Object should be the name of the spawn point as written in the ARE file.
 */
declare function SpawnPtSpawn(object: ObjectPtr): void;

/**
 * This action acts like Shout() without the range limit.
 */
declare function GlobalShout(id: number): void;

/**
 * This action is used in conjunction with animations in ARE files. The action will start the specified animation.
 */
declare function StaticStart(object: ObjectPtr): void;

/**
 * This action is used in conjunction with animations in ARE files. The action will stop the specified animation.
 */
declare function StaticStop(object: ObjectPtr): void;

/**
 * This action instructs the active creature to follow the target object, in the specified formation, taking up the specified position. The Formation parameter represents the formation type (e.g. two lines, arrowhead, single line). The position should be in the range [0,5]. The example script is from dlsctc02.bcs.

```weidu-baf
  IF
    !Range("DLSCTC02",12)
    Global("DontFollow","DL0302",0)
  THEN
    RESPONSE #100
      FollowObjectFormation("DLSCTC02",1,6)
    RESPONSE #100
      FollowObjectFormation("DLSCTC02",1,5)
    RESPONSE #100
      FollowObjectFormation("DLSCTC02",2,6)
    RESPONSE #100
      FollowObjectFormation("DLSCTC02",2,5)
  END
  
  IF
    Global("FollowTheLeader","LOCALS",1)
    Range("DLSCTC02",6)
    Global("DontFollow","DL0302",0)
  THEN
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",0)
  END
  
  IF
    OR(2)
    !Range("DLSCTC02",9)
    Range("DLSCTC02",1)
    Global("DontFollow","DL0302",0)
  THEN
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",1,2)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",1,3)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",1,4)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",1,5)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",1,1)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",2,1)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",2,2)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",2,3)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",2,4)
    RESPONSE #100
      SetGlobal("FollowTheLeader","LOCALS",1)
      FollowObjectFormation("DLSCTC02",2,5)
  END
```
 */
declare function FollowObjectFormation(object: ObjectPtr, formation: number, position: number): void;

/**
 * This action causes the active creature to become the players ally. The active creature does not act as a normal familiar (i.e. no HP bonus or Constitution loss on death).
 */
declare function AddFamiliar(): void;

/**
 * This action removes the ally flag set by AddFamiliar.
 */
declare function RemoveFamiliar(): void;

/**
 * This action pauses the game. Script processing is halted while the game is paused.
 */
declare function PauseGame(): void;

/**
 * This action will change the animation of the active creature to match that of the specified CRE file. If the active creature is in the party, the action will create the specified creature. No lighting effects are played.
 */
declare function ChangeAnimationNoEffect(resref: string): void;

/**
 * This action instructs the active creature to move to the specified object. The action does not update the current position of the actor, saved in ARE files. The example script shows the creature moving towards the nearest enemy.

```weidu-baf
  IF
    See(NearestEnemyOf())
    !Range(NearestEnemyOf(),4)
  THEN
    RESPONSE #100
      MoveToObject(NearestEnemyOf())
  END
```
 */
declare function MoveToObject(target: ObjectPtr): void;

/**
 * This action removes the items listed in the specified 2DA file from the party.
 */
declare function TakeItemListParty(resref: string): void;

/**
 * This action destroys all items on the active creature.
 */
declare function DestroyAllEquipment(): void;

/**
 * This action causes the active creature to give all their items to the party.
 */
declare function GivePartyAllEquipment(): void;

/**
 * This action will move the active creature to the specified point in the indicated area, facing the appropriate direction, and plays the specified graphics when the creature disappears.
 */
declare function MoveBetweenAreasEffect(area: string, graphic: string, location: Point, face: number): void;

/**
 * This action will move the active creature to the specified point in the indicated area, facing the appropriate direction.
 */
declare function MoveBetweenAreas(area: string, location: Point, face: number): void;

/**
 * This action will remove the specified number of items from the party, as listed in the specified 2DA file.
 */
declare function TakeItemListPartyNum(resref: string, num: number): void;

/**
 * 
 */
declare function CreateCreatureObjectEffect(resref: string, effect: string, object: ObjectPtr): void;

/**
 * This action will create the specified creature next to the specified object. The facing of the creature is controlled by the Usage1 parameter.
 */
declare function CreateCreatureObject(resref: string, object: ObjectPtr, usage1: number, usage2: number, usage3: number): void;

/**
 * This action creates the specified creature on a normally impassable surface (e.g. on a wall, on water, on a roof).
 */
declare function CreateCreatureImpassable(newobject: string, location: Point, face: number): void;

/**
 * This action instructs the active creature to face the target object.
 */
declare function FaceObject(object: ObjectPtr): void;

/**
 * This action causes the active creature to move to the specified coordinates. The action will update the position of creatures as stored in ARE files (first by setting the coordinates of the destination point, then by setting the coordinates of the current point once the destination is reached).

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      MoveToPoint([526.1193])
      Wait(3)
      RandomWalk()
      Wait(5)
      RandomWalk()
  END
```
 */
declare function MoveToPoint(point: Point): void;

/**
 * This action duplicates the effects of resting. Such resting is not interruptible, and functions even if enemies are nearby.
 */
declare function RestParty(): void;

/**
 * This action creates the specified creature at the specified location, and plays the dimension door graphic. The creature appears after approximately 100 AI cycles (~3.5 seconds at the default of 30 frame/second).
 */
declare function CreateCreatureDoor(newobject: string, location: Point, face: number): void;

/**
 * This action will create the specified creature next to the specified object, and plays the dimension door graphic. The facing of the creature is controlled by the Usage1 parameter. The creature appears after approximately 100 AI cycles (~3.5 seconds at the default of 30 frame/second).
 */
declare function CreateCreatureObjectDoor(resref: string, object: ObjectPtr, usage1: number, usage2: number, usage3: number): void;

/**
 * This action creates the specified creature just off-screen from the current viewpoint (the north/south/east/west direction is random). The facing of the creature is controlled by the Usage1 parameter.
 */
declare function CreateCreatureObjectOffScreen(resref: string, object: ObjectPtr, usage1: number, usage2: number, usage3: number): void;

/**
 * This action moves the object creature a screen away from the specified target creature. The target object must be stored in the GAM file (i.e. NPC or added explicitly via the MakeGlobal action.
 */
declare function MoveGlobalObjectOffScreen(object: ObjectPtr, target: ObjectPtr): void;

/**
 * This action removes the specified strref from the quest section of the journal.
 */
declare function SetQuestDone(strRef: number): void;

/**
 * This action stores the current location of party members in the GAM file.
 */
declare function StorePartyLocations(): void;

/**
 * This action moves the party to the stored locations (previously stored with StorePartyLocations). The action clears the stored locations from the GAM file.
 */
declare function RestorePartyLocations(): void;

/**
 * This action creates the specified creature just offscreen from the active creature.
 */
declare function CreateCreatureOffScreen(resref: string, face: number): void;

/**
 * This action moves the active creature to the centre of the screen. Script conditions are not checked for the specified duration (measured in seconds) or until the creature has reached the screen centre.
 */
declare function MoveToCenterOfScreen(notinterruptablefor: number): void;

/**
 * This action causes the active creature to move randomly around the screen.

```weidu-baf
  IF
    HPPercentLT(Myself,15)
  THEN
    RESPONSE #100
     Panic()
  END
```
 */
declare function Panic(): void;

/**
 * 
 */
declare function ReallyForceSpellDeadRES(res: string, target: ObjectPtr): void;

/**
 * This action causes the active creature to cast the specified spell at the target object. The spell need not currently be memorised by the caster, and will not be interrupted while being cast. The spell is cast instantly (i.e. with a casting time of 0). The caster must meet the level requirements of the spell. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long. This action works in the script round where the active creature has died.

```weidu-baf
  IF
    Die()xx
  THEN
    RESPONSE #100
      ReallyForceSpellDead(Myself,ILLUSION_DEATH)
      Wait(1)
      DestroySelf()
  END
```

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8th character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function ReallyForceSpellDead(target: ObjectPtr, spell: number): void;

/**
 * This action removes the berserking state and effect by applying the `Cure:Berserk` opcode.
 */
declare function Calm(object: ObjectPtr): void;

/**
 * This action changes the active creature's allegiance to ALLY (i.e. a green selection circle).
 */
declare function Ally(): void;

/**
 * This action rests the party, but doesn't force healing spells to be cast on injured party members.
 */
declare function RestNoSpells(): void;

/**
 * This action is similar to StorePartyLocations() but with one object.
 */
declare function SaveLocation(area: string, global: string, point: Point): void;

/**
 * This action stores the location of the specified object in the named variable.

```weidu-baf
  IF
    Global("SavedMyPos","LOCALS",0)
  THEN
    RESPONSE #50
      SetGlobal("SavedMyPos","LOCALS",1)
      SaveObjectLocation("LOCALS","DefaultLocation",Myself)
  END
```
 */
declare function SaveObjectLocation(area: string, global: string, object: ObjectPtr): void;

/**
 * This action creates the specified creature at the specified saved location.
 */
declare function CreateCreatureAtLocation(global: string, area: string, resref: string): void;

/**
 * This action sets the specified token to the specified value. Whenever the token is then used within a strref, the current value of the token will be displayed. Values assigned by this action are not saved.
 */
declare function SetToken(token: string, strRef: number): void;

/**
 * This action sets the token specified by the string parameter (e.g. DAMAGER) to the name of the object specified in the object parameter. Values assigned by this action are not persisted to save games.
 */
declare function SetTokenObject(token: string, object: ObjectPtr): void;

/**
 * This action updates various tokens based on the specified object.
 */
declare function SetGabber(object: ObjectPtr): void;

/**
 * This action instructs the active creature to attempt to pickpocket the target. This action can be used for any creature (not just thieves) though success in pick pocketing is dependent on points in the Pickpocket skill. Note that a failed pickpocket attempt is treated as an attack, hence the Attacked() trigger will return true if a pickpocket attempt is failed.

```weidu-baf
  IF
    See([ANYONE])
    OR(2)
    Class(Myself,THIEF_ALL)
    Class(Myself,BARD_ALL)
  THEN
    RESPONSE #100
      PickPockets([ANYONE])
  END
```
 */
declare function PickPockets(target: ObjectPtr): void;

/**
 * 
 */
declare function CreateCreatureObjectCopyEffect(resref: string, effect: string, object: ObjectPtr): void;

/**
 * This action creates the specified creature and sets its animation to that of the active creature.
 */
declare function CreateCreatureObjectCopy(resref: string, object: ObjectPtr, usage1: number, usage2: number, usage3: number): void;

/**
 * This action hides an area on the worldmap, preventing travelling to it.
 */
declare function HideAreaOnMap(resref: string): void;

/**
 * This action creates the specified creature at a location offset from the target object point.
 */
declare function CreateCreatureObjectOffset(resref: string, object: ObjectPtr, offset: Point): void;

/**
 * This action is used in conjunction with containers in ARE files. The action sets the enabled state of a container (specified by the object parameter).
 */
declare function ContainerEnable(object: ObjectPtr, bool: number): void;

/**
 * This action shakes the game view. The point parameter dictates how far to shake the screen along the x and y axis. The duration parameter dictates how long the shaking lasts.
 */
declare function ScreenShake(point: Point, duration: number): void;

/**
 * This action will add the variable specified by parameter 2 onto the variable specified by parameter 1. It only works for variables in the "GLOBAL" scope. An example script is below.

```weidu-baf
  IF
    Global("Var1","GLOBAL",0)
  THEN
    RESPONSE #100
      SetGlobal("Var1","GLOBAL",75) //Var1 = 75
      SetGlobal("Var2","GLOBAL",25) //Var2 = 25
      AddGlobals("Var1","Var2") //Var1 = 100
  END
```
 */
declare function AddGlobals(name: string, name2: string): void;

/**
 * 
 */
declare function CreateItemGlobal(global: string, area: string, resref: string): void;

/**
 * This action creates a quantity of items equal to a global variable on the active creature. The example script will create 50 arrows.

```weidu-baf
  IF
    Global("Arrows","LOCALS",0)
  THEN
    RESPONSE #100
      SetGlobal("Arrows","LOCALS",50)
      CreateItemNumGlobal("Arrows","LOCALS","AROW01")
  END
```
 */
declare function CreateItemNumGlobal(global: string, area: string, resref: string): void;

/**
 * This action instructs the active creature remove the item from the area and put it in their inventory (assuming the inventory has enough room and the item exists).
 */
declare function PickUpItem(resref: string): void;

/**
 * This action will attempt to fill a slot in the active creature's inventory with the appropriate item type. Using FillSlot(SLOT\_WEAPON) will look for any weapon in the inventory, and move the first such item into the weapon slot. Any item already in the slot is destroyed.
 */
declare function FillSlot(slot: number): void;

/**
 * This action adds the specified amount of XP onto the specified object.
 */
declare function AddXPObject(object: ObjectPtr, xp: number): void;

/**
 * This action will cause the active creature to play the specified sound. Both WAV and WAVC files can be played by the action. Sound is played through the sound effects channel. Volume fades if the viewport is moved further away from the active creature.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      PlaySound("CAS_M06")
  END
```
 */
declare function PlaySound(sound: string): void;

/**
 * This action removes the specified amount of gold from the party. DestroyGold(0) will remove all gold from current creature. Note that this action affects the gold stat of the creature (not Party Gold or MISC07 items).
 */
declare function DestroyGold(gold: number): void;

/**
 * This action stores a "home" location into memory for a creature. The location is not saved.
 */
declare function SetHomeLocation(point: Point): void;

/**
 * This action displays the strref specified by the StrRef parameter in the message window, without attributing the text to an object.
 */
declare function DisplayStringNoName(object: ObjectPtr, strref: number): void;

/**
 * This action removes the specified strref from the journal, regardless of the journal section the entry is in - except the user section.
 */
declare function EraseJournalEntry(strRef: number): void;

/**
 * This action copies all items lying around on the ground in the current area to the specified point in the target area.
 */
declare function CopyGroundPilesTo(resref: string, location: Point): void;

/**
 * 
 */
declare function DialogForceInterrupt(object: ObjectPtr): void;

/**
 * These actions work the same as their counterpart dialog actions. The only difference is that they are important enough to interrupt other dialogs already in action.
 */
declare function DialogueForceInterrupt(object: ObjectPtr): void;

/**
 * 
 */
declare function StartDialogueInterrupt(dialogfile: string, target: ObjectPtr): void;

/**
 * 
 */
declare function StartDialogInterrupt(dialogfile: string, target: ObjectPtr): void;

/**
 * 
 */
declare function StartDialogNoSetInterrupt(object: ObjectPtr): void;

/**
 * 
 */
declare function StartDialogueNoSetInterrupt(object: ObjectPtr): void;

/**
 * This action sets a global timer measured in seconds (of real time).
 */
declare function RealSetGlobalTimer(name: string, area: string, time: number): void;

/**
 * This action displays the specified string over the head on the specified object (on the game-screen). The string may also be shown in the message log, depending on options specified in baldur.ini.

```weidu-baf
  IF
    HPPercentLT(Myself,50)
    HasItem("Potn52",Myself)
  THEN
    RESPONSE #100
      DisplayStringHead(Myself,46150)
      UseItem("Potn52",Myself)
  END
```

If the object's name is unset or set to an invalid strref, it will be attributed to the protagonist in the message log. To avoid that, use `DisplayStringNoNameHead()`, or `SAY` the creature's `NAME` to ~~ (empty string) when coding it in WeIDu.
 */
declare function DisplayStringHead(object: ObjectPtr, strref: number): void;

/**
 * This action causes the active creature to guard the specified point, staying within the specified range.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      ProtectPoint([1738.543],10)
  END
```
 */
declare function ProtectPoint(target: Point, range: number): void;

/**
 * This action changes the animation of the active creature to match the animation of the target object.
 */
declare function PolymorphCopy(object: ObjectPtr): void;

/**
 * This action plays the specified sound from the character's soundset.
 */
declare function VerbalConstantHead(object: ObjectPtr, constant: number): void;

/**
 * This action plays the animation specified by the object parameter at the specified location ([x.y]). Animation preference order is applied, i.e. the engine first looks to play a VVC file of the specified name, if no such a file exists, the engine looks to play a BAM file of the specified.
 */
declare function CreateVisualEffect(object: string, location: Point): void;

/**
 * This action plays the animation specified by the (mis-named) DialogFile parameter on the specified object. Animation preference order is applied, i.e. the engine first looks to play a VVC file of the specified name, if no such a file exists, the engine looks to play a BAM file of the specified.
 */
declare function CreateVisualEffectObject(dialogfile: string, target: ObjectPtr): void;

/**
 * This action removes the active creature's current kit and adds the specified kit. Abilities from any previous kit are removed. AddKit(0) can be used to remove a creatures current kit without adding a new one. Class restrictions apply for kits. When attempting adding an invalid kit, the existing kit (if any) will be replied.
 */
declare function AddKit(kit: number): void;

/**
 * This action can be used to manually start the combat counter.
 */
declare function StartCombatCounter(): void;

/**
 * This action instructs the active creature to leave the area by choosing the fastest ways out of the sight of the party. The creature disappears as soon as it is out of sight. Otherwise, it disappears after a set amount of time.
 */
declare function EscapeAreaNoSee(): void;

/**
 * This action instructs the target object to leave the current area, either by walking, or, if the path is blocked, by simply disappearing. The action functions as a combination of EscapeAreaDestroy() and MoveBetweenAreas(). The parameters are similar to MoveBetweenAreas(), in that it takes in all the same information, but unlike MoveBetweenAras(), the character will search for the nearest travel trigger, move to that, then execute his movement to the specified area. If he cannot find a travel trigger, he will execute the movement.
 */
declare function EscapeAreaObjectMove(resref: string, object: ObjectPtr, x: number, y: number, face: number): void;

/**
 * This action instructs the active creature to leave the area via the specified region.
 */
declare function EscapeAreaObject(object: ObjectPtr): void;

/**
 * This action replaces the item in second parameter with the item in first parameter. If the target does not have the item in the second parameter, the item in the first parameter will still be created in the inventory. Note that this action will not automatically equip the item that's created.
 */
declare function TakeItemReplace(give: string, take: string, object: ObjectPtr): void;

/**
 * This action adds the specified spell to the active creature. The message <creature\_name> has gained a special ability: "Ability" is displayed in the message log.
 */
declare function AddSpecialAbility(resref: string): void;

/**
 * This action causes the active creature to attempt to disarm the specified trap. This action can be used for any creature (not just thieves) though success in disarming is dependent on points in the Disarm Trap skill.

```weidu-baf
  IF
    See("Trap01")
    Class(Myself,THIEF_ALL)
  THEN
    RESPONSE #100
      RemoveTraps("Trap01")
  END
```
 */
declare function RemoveTraps(trap: ObjectPtr): void;

/**
 * This action destroys all destructible equipment on the active creature. Items flagged as indestructible (magical) will not be destroyed.
 */
declare function DestroyAllDestructableEquipment(): void;

/**
 * This action changes a Paladin to a Fallen Paladin.
 */
declare function RemovePaladinHood(): void;

/**
 * This action changes a Ranger to a Fallen Ranger.
 */
declare function RemoveRangerHood(): void;

/**
 * This action restores a Fallen Paladin to normal Paladin status if reputation is 10 or more. Otherwise increments Reputation to 10 and nothing else.
 */
declare function RegainPaladinHood(): void;

/**
 * This action restores a Fallen Ranger to normal Ranger status. If reputation is lower than 10 it is increased to 10.
 */
declare function RegainRangerHood(): void;

/**
 * This action copies the base animation (i.e. no armour or colouring) of the target creature to the active creature.
 */
declare function PolymorphCopyBase(object: ObjectPtr): void;

/**
 * This action hides the docking borders, menus, etc. on the sides of the screen.
 */
declare function HideGUI(): void;

/**
 * This action restores the docking borders, menus etc. to the sides of the screen.
 */
declare function UnhideGUI(): void;

/**
 * This action changes the name of the active creature to the specified strref.
 */
declare function SetName(strRef: number): void;

/**
 * This action sets the active creatures kit to the specified kit . Abilities from any previous kits are kept. Class restrictions apply for kits. When attempting adding an invalid kit, the existing kit (if any) will be replied.
 */
declare function AddSuperKit(kit: number): void;

/**
 * This action causes the active creature to run away from the specified creature, for the specified time. The time parameter is measured in AI updates, which default to 15 updates per second. Occasionally, fleeing creatures stop to attack another creature.

```weidu-baf
  IF
    HPPercentLT(Myself,30)
  THEN
    RESPONSE #100
      RunAwayFrom(LastAttackerOf(Myself),180)
  END
```
 */
declare function RunAwayFrom(creature: ObjectPtr, time: number): void;

/**
 * 
 */
declare function PlayDeadInterruptible(time: number): void;

/**
 * This action instructs the active creature to "play dead", i.e. to lay on the ground, for the specified interval (measured in AI updates per second (AI updates default to 15 per second). If used on a PC, the player can override the action by issuing a standard move command. Other conditions are checked during the play dead period.
 */
declare function PlayDeadInterruptable(time: number): void;

/**
 * This action says to jump the object in the first parameter to the object in the second parameter. The object in the first parameter does NOT have to be in the same area as the target, but must already be present in the saved game (as either an NPC or MakeGlobal()).
 */
declare function MoveGlobalObject(object: ObjectPtr, target: ObjectPtr): void;

/**
 * This action displays the specified strref over the head of the creature with the specified item. The action only checks current party members.
 */
declare function DisplayStringHeadOwner(item: string, strRef: number): void;

/**
 * 
 */
declare function StartDialogOverride(dialogfile: string, target: ObjectPtr, unused0: number, unused1: number, converseasitem: number): void;

/**
 * This action instructs the active creature to start the specified dialog with the specified target. The dialog can be initiated from a distance and must have at least one state with all its top level conditions true else it will not initiate. The active creature will not have its dialog file permanently set to the file specified by the DialogFile parameter.
The second signature of this action is not listed in the action.ids file provided with the game. When using this signature, the third integer paramter can be used to indicate the dialog is initiated by an item (e.g. Lilarcor) - if this is the case, the item name will be used as the creature name in the feedback window.
 */
declare function StartDialogOverride(dialogfile: string, target: ObjectPtr): void;

/**
 * This action creates the specified creature at the specified point and sets its animation to that of the active creature.
 */
declare function CreateCreatureCopyPoint(resref: string, object: ObjectPtr, dest: Point): void;

/**
 * This action instructs the active creature to play their associated bard song.
 */
declare function BattleSong(): void;

/**
 * 
 */
declare function MoveToSavedLocationn(global: string, area: string): void;

/**
 * This action instructs the active creature to move to the previously saved specified location.

```weidu-baf
  IF
    Global("MoveToLocation","LOCALS",0)
  THEN
    RESPONSE #50
      SetGlobal("MoveToLocation","LOCALS",1)
      MoveToSavedLocationn("DefaultLocation","LOCALS")
  END
```
 */
declare function MoveToSavedLocation(global: string, area: string): void;

/**
 * This action inflicts the specified amount of damage (of the specified type) on the target creature.
 */
declare function ApplyDamage(object: ObjectPtr, amount: number, type: number): void;

/**
 * This action extends the time taken for the banter timer to expire. The banter timers are hardcoded and every time one expires an NPC's b****.dlg is called.
 */
declare function BanterBlockTime(time: number): void;

/**
 * This action instructs the active creature to continually attack the target, i.e. the active creature will not switch targets until its target is dead.

```weidu-baf
  IF
    See([EVILCUTOFF])
    Class(LastSeenBy(),MAGE_ALL)
    !InParty(LastSeenBy())
  THEN
    RESPONSE #100
      Attack(LastSeenBy())
  END
```
 */
declare function Attack(target: ObjectPtr): void;

/**
 * This action sets a variable (specified by name) in the scope (specified by area) to the value (specified by value). See the [variable type](../../appendices/variables.htm) appendix for details on variables.

```weidu-baf
  IF
    Global("KRINAREA","AR0400",0)
  THEN
    RESPONSE #100
      CreateCreature("ORC01",[1738.543],0)
      SetGlobal("KRINAR EA","AR0400",1)
  END
```
 */
declare function SetGlobal(name: string, area: string, value: number): void;

/**
 * This action dictates whether the banter timer can expire.
 */
declare function BanterBlockFlag(state: number): void;

/**
 * This action is used in conjunction with animations in ARE files. The action sets the enabled state of an animation (specified by the object parameter).
 */
declare function AmbientActivate(object: ObjectPtr, state: number): void;

/**
 * It is likely that the first parameter refers to a transition trigger and the second parameter refers to a door type in an area. In this manner, the trigger is activated and deactivated based on the open state of the door.
 */
declare function AttachTransitionToDoor(global: string, object: ObjectPtr): void;

/**
 * This action applies a percentage damage (of the specified damage type) to the target object.
 */
declare function ApplyDamagePercent(object: ObjectPtr, amount: number, type: number): void;

/**
 * This action acts as a shortcut for SetGlobal(). The action can only set global variables.
 */
declare function SG(name: string, num: number): void;

/**
 * This action will add a map note onto the current area's mini-map at the specified position. The position is a location on the actual area map (not the minimap).
 */
declare function AddMapNote(position: Point, stringref: number): void;

/**
 * This action ends the demo and returns the player to the game selection screen.
 */
declare function DemoEnd(): void;

/**
 * 
 */
declare function SpellRES(res: string, target: ObjectPtr): void;

/**
 * This action causes the active creature to cast the specified spell at the target object. The spell must currently be memorised by the caster, and may be interrupted while being cast. The caster must meet the level requirements of the spell. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long.

```weidu-baf
  IF
    See([EVILCUTOFF])
    !InParty([EVILCUTOFF])
    !HasBounceEffects([ EVILCUTOFF])//like cloak of mirroring or spell deflection
    !HasImmunityEffects([EVILCUTOFF])//
    HaveSpell(WIZARD_MAGIC_MISSILE)
    OR(2)
    !StateCheck([EVILCUTOFF],STATE_INVISIBLE)
    !StateCheck([EVILCUTOFF],STATE_IMPROVEDINVISIBLITY)
    CheckStatLT([EVILCUTOFF], 30,RESISTMAGIC)
    !Race([EVILCUTOFF],LICH)
    !Race([EVILCUTOFF],RAKSHASA)
  THEN
    RESPONSE #100
      Spell([EVILCUTOFF],WIZARD_MAGIC_MISSILE)
  END
```

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console **IF** the 8<sup>th</sup> character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function Spell(target: ObjectPtr, spell: number): void;

/**
 * It is likely to move all creatures present in the saved game that are currently in the FromArea parameter and move them to the Location in the ToArea parameter.
 */
declare function MoveGlobalsTo(fromarea: string, toarea: string, location: Point): void;

/**
 * This action displays the specified string over the head on the specified object (on the game-screen). The text stays onscreen until the associated sound has completed playing.
 */
declare function DisplayStringWait(object: ObjectPtr, strref: number): void;

/**
 * This action instructs all creatures in the current area(?) ignore the following states flags for the time specified, or until a save-game reload. The creatures still have the state flags set. This action mainly seems to be used to get player characters to look like they are "paying attention" to anything that is happening around them.
The following states are overridden:

* state\_sleeping
* state\_panic
* state\_stunned
* state\_helpless
* state\_confused

The following states are not overridden:

* state\_invisible
* state\_frozen\_death
* state\_stone\_death
* state\_dead
* state\_silence
* state\_charmed
* state\_improved invisibility
* state\_mirror\_image

Other states are untested.
 */
declare function StateOverrideTime(time: number): void;

/**
 * 
 */
declare function StateOverrideFlag(state: number): void;

/**
 * This action modifies the probability of a daytime rest interruption (by modifying fields in the ARE file).
 */
declare function SetRestEncounterProbabilityDay(prob: number): void;

/**
 * This action modifies the probability of a night-time rest interruption (by modifying fields in the ARE file).
 */
declare function SetRestEncounterProbabilityNight(prob: number): void;

/**
 * This action is used in conjunction with ambient sounds in ARE files. The action sets the enabled state of an ambient sound (specified by the object parameter).
 */
declare function SoundActivate(object: ObjectPtr, state: number): void;

/**
 * The action plays the specified song. Values are from [SONGLIST.2DA]({{ 2da }}/songlist.htm).
 */
declare function PlaySong(song: number): void;

/**
 * 
 */
declare function ForceSpellRangeRES(res: string, target: ObjectPtr): void;

/**
 * It is likely that it will force the specified spell if the target is within range of the spell.

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8th character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function ForceSpellRange(target: ObjectPtr, spell: number): void;

/**
 * 
 */
declare function ForceSpellPointRangeRES(res: string, target: Point): void;

/**
 * It is likely that it will force the specified spell if the point is within range of the spell.

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8th character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function ForceSpellPointRange(target: Point, spell: number): void;

/**
 * This action changes the specified sound reference (SndSlot) on the specified creature to the specified value. It should be noted that the biography can be changed by this action, as it is listed as a SoundSlot (EXISTANCE5).
 */
declare function SetPlayerSound(object: ObjectPtr, strRef: number, slotnum: number): void;

/**
 * This action dictates whether resting is allowed in the current area.
 */
declare function SetAreaRestFlag(canrest: number): void;

/**
 * This action removes effects with a duration timing mode from the specified object, if the remaining duration is below the ticks parameter. The action appears to only work from a creature script.
 */
declare function FakeEffectExpiryCheck(object: ObjectPtr, ticks: number): void;

/**
 * This action creates the specified creature at the specified location, facing the specified direction. The creature will be created even if the searchmap is marked as impassable, or whether there are any other obstructions.
 */
declare function CreateCreatureImpassableAllowOverlap(newobject: string, location: Point, face: number): void;

/**
 * This action sets the 'BeenInParty' flag in the [CRE](../../file_formats/ie_formats/cre_v1.htm#CREV1_0_Header) file of the active creature. This action also triggers appropriate dialog and script file changes (as referenced in [PDIALOG.2DA]({{ 2da }}/pdialog.htm)).
 */
declare function SetBeenInPartyFlags(): void;

/**
 * This action returns the player to the game start screen.
 */
declare function GoToStartScreen(): void;

/**
 * This action teleports the party to the area from which the "Area Switch: Pocket Plane" effect was last used. If this effect has never been used, or the party is not in the Pocket Plane this action has no effect.
 */
declare function ExitPocketPlane(): void;

/**
 * This action gives a level dependent amount of XP to the party or a single party member. The XP amount is listed in [XPLIST.2DA]({{ 2da }}/xplist.htm) at the intersection of the party level (column) and quest row (the mis-named parameter). The file lists the same XP value for all quests for all levels.
 */
declare function AddXP2DA(column: string): void;

/**
 * This will remove a map note from the current area's mini-map at the specified position. The position is a location on the actual area map (not the minimap).
 */
declare function RemoveMapNote(position: Point, strRef: number): void;

/**
 * This action turns any undead creatures within range of the active creature. This action can be used for any creature (not just paladins/clerics) though success in turning is dependent on the Turn Undead level of the creature, which is only calculated for paladins and clerics. The chance to successfully turn undead is based on creatures level and class. Paladins turn at 2 levels less than clerics of the same level. An undead creature will be destroyed/controlled if its level is more than 7 levels below the active creatures turn undead level. An undead creature may be turned (i.e. forced to flee) is its level is equal to, or up to 4 levels below, the active creatures turn undead level.

```weidu-baf
  IF
    See([EVILCUTOFF])
    General([EVILCUTOFF],UNDEAD)
    LevelGT(Mysel f,12)
    OR(2)
    Class(Myself,PALADIN_ALL)
    Class(Myself,CLERIC_ALL)
  THEN
    RESPONSE #100
      Turn()
  END
```
 */
declare function Turn(): void;

/**
 * This action will add area type flags (e.g. outdoor, dungeon) to the current area. The areatype value is OR'd, so multiple values can be set. Values are from [areatype.ids]({{ ids }}/areatype.htm)
 */
declare function AddAreaType(type: number): void;

/**
 * This action will remove area type flags (e.g. outdoor, dungeon) to the current area. Values are from [areatype.ids]({{ ids }}/areatype.htm)
 */
declare function RemoveAreaType(type: number): void;

/**
 * This action will add area flags (e.g. save enabled, tutorial) to the current area. The area flags value is OR'd, so multiple values can be set. Values are from [areaflag.ids]({{ ids }}/areaflag.htm).
 */
declare function AddAreaFlag(type: number): void;

/**
 * This action will remove area flags (e.g. save enabled, tutorial) to the current area. The area flags value is OR'd, so multiple values can be set. Values are from [areaflag.ids]({{ ids }}/areaflag.htm).
 */
declare function RemoveAreaFlag(type: number): void;

/**
 * This action instructs the active creature to start the specified dialog with the specified target. The dialog can be initiated from a distance and must have at least one state with all its top level conditions true else it will not initiate. The active creature name will not appear as the dialog attribution.
 */
declare function StartDialogNoName(dialogfile: string, target: ObjectPtr): void;

/**
 * This action sets the specified token to the given variable (in the specified scope). The example script will display 100 over the head of the active creature.

```weidu-baf
  IF
    Global("Value","GLOBAL",0)
  THEN
    RESPONSE #100
      SetGlobal("Value","GLOBAL",100)
      SetTokenGlobal("Value","GLOBAL","PPOINTS")
      DisplayStringHead(Myself,63037) //63037  is <PPOINTS> for me
  END
```
 */
declare function SetTokenGlobal(global: string, area: string, token: string): void;

/**
 * This action adds the active creature to the GAM file (if it isn't there already).
 */
declare function MakeGlobal(): void;

/**
 * 
 */
declare function ReallyForceSpellPointRES(res: string, target: Point): void;

/**
 * This action causes the active creature to cast the specified spell at the target point. The spell need not currently be memorised by the caster, and will not be interrupted while being cast. The spell is cast instantly (i.e. with a casting time of 0). The caster must meet the level requirements of the spell. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long.

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8<sup>th</sup> character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function ReallyForceSpellPoint(target: Point, spell: number): void;

/**
 * 
 */
declare function CutAllowScripts(bool: number): void;

/**
 * 
 */
declare function SetCursorState(bool: number): void;

/**
 * This action starts a cutscene. Player control is removed, though all scripts keep running. Note that actions already in the action list are not cleared without an explicit call to ClearAllActions. The example script is from are0507.bcs.
 */
declare function SetCutSceneLite(bool: number): void;

/**
 * This action instructs the active creature to play the swing weapon animation once. Note that some objects do not have this animation.
 */
declare function SwingOnce(): void;

/**
 * 
 */
declare function UseItemSlot(target: ObjectPtr, slot: number): void;

/**
 * 
 */
declare function UseItemSlotAbility(target: ObjectPtr, slot: number, ability: number): void;

/**
 * This action instructs the active creature to use the specified item (object) on the specified target (target). The ability number (i.e. extended header index) to use may be specified. This action is most often used to allow use of potions and wands. The item to be used must exist in the active creature's inventory (not in a container within the inventory) - though it need not be equipped.

```weidu-baf
  IF
    HPPercentLT(Myself,50)
    HasItem("potn52",Myself)
  THEN
    RESPONSE #100
      DisplayStringHead(Myself,46150) //quaffs a potion
      UseItem("potn52",Myself)
      Continue()
  END
```

IWDEE supports also the `UseItemAbility` signature:
```weidu-baf
  IF
    !StateCheck(Myself,STATE_MIRRORIMAGE)
    GlobalLT("MO_UsedIlbratha","GLOBAL",1)
    HasItemEquiped("SW1H26",Myself)  // Ilbratha +1
  THEN
    RESPONSE #100
      SetInterrupt(FALSE)
      UseItemAbility("SW1H26",Myself,SLOT_AMMO3,1)  // Ilbratha +1
      SetInterrupt(TRUE)
      IncrementGlobal("MO_UsedIlbratha","GLOBAL",1)
  END
```
 */
declare function UseItem(object: string, target: ObjectPtr): void;

/**
 * This action is used in conjunction with animations in ARE files. The action will start the specified animation sequence.
 */
declare function StaticSequence(object: ObjectPtr, sequence: number): void;

/**
 * This action changes the palette (BMP file) of the specified animation object.
 */
declare function StaticPalette(palette: string, object: ObjectPtr): void;

/**
 * This action displays the specified string over the head on the specified object (on the game-screen) even if the target is dead.
 */
declare function DisplayStringHeadDead(object: ObjectPtr, strref: number): void;

/**
 * This action moves the party to ToB, changes the worldmap, and switches scripts and dialogs to the X25 versions.
 */
declare function MoveToExpansion(): void;

/**
 * This action will immediately set the weather to raining, over the current overlay (rather than taking several seconds to darken the area before starting to rain).
 */
declare function StartRainNow(): void;

/**
 * This action instructs the active creature to perform the specified animation sequence. Values are from [seq.ids]({{ ids }}/seq.htm).
 */
declare function SetSequence(sequence: number): void;

/**
 * This action displays the specified string over the head on the specified object (on the game-screen), without displaying it in the message log.
 */
declare function DisplayStringNoNameHead(object: ObjectPtr, strref: number): void;

/**
 * This action modifies the probability of a travel encounter (by modifying fields in the WMP file) between the specified areas.
 */
declare function SetEncounterProbability(fromarea: string, toarea: string, probability: number): void;

/**
 * This action instructs the engine to use the specified column of [WISH.2DA]({{ 2da }}/wish.htm), randomly select 5 choices (rows; count appears hardcoded) and set the appropriate globals for those spells. Once the maximum "wish choices" have been selected, the dialog continues and casts the selected spell.

From a dialog:
```weidu-baf
  IF ~CheckStatGT(LastTalkedToBy,17,WIS)~ THEN DO ~SetupWish(4,1)~ GOTO 8
  IF ~Global("WishPower01","GLOBAL",1)~ THEN REPLY #72526 // ~'Breach' on everyone in the area, including the party.~
    DO ~ActionOverride(LastTalkedToBy,ForceSpellRES("spwish26",Myself)) ApplySpell(Myself,POOF_GONE)~ EXIT
```

The key is the `Global("WishPower**","GLOBAL",1)`. The highest is "WishPower37", and the highest number in the WISH.2DA is also 37. There are a total of 46 SPWISH\*\*.SPL files, but 9 are unused:

* SPWISH01 STR Bonus +1
* SPWISH02 INT Bonus +1
* SPWISH03 DEX Bonus +1
* SPWISH04 CON Bonus +1
* SPWISH05 WIS Bonus +1
* SPWISH06 CHA Bonus +1
* SPWISH07 Restoration
* SPWISH09 Globe of Blades
* SPWISH15 Gain 10,000 Gold (Party)

Looking at the spells that have a "WishPower\*\*" next to them, this list can be derived (sorted by Wisdom level (E=enemies, P=party, C=caster A=All)):
```weidu-baf
  Low (9-)            Medium (10-14)      High (15-17)        Ultra (18+)
  
  Heal             E  Heal             E  Heal             E  TS & IA (X2)     P
  Improved Haste   E  Improved Haste   E  Improved Haste   E  Improved Haste   E
  Dark Planetar    E  Silenced         A  Dark Planetar    E  Lose 10,000 gp   P
  Level Drain      P  Level Drain      P  WIS (3)          P  Level Drain      P
  Hit Points -50%  C  Hit Points -50%  C  TS & IA (X2)     P  Hit Points -50%  C
  Hit Points -15%  P  Haste            A  Hit Points -15%  P  Mass Raise Dead  P
  Lose Spells      C  Lose Spells      C  Lose Spells      C  WIS (3)          P
  STR (3)          P  STR (3)          P  STR (3)          P  Haste            A
  CON (3)          P  CON (3)          P  Stats (25)       P  Stats (25)       P
  DEX (3)          P  DEX (3)          P  DEX (3)          P  Rest & Remem.    P
  INT (3)          P  INT (3)          P  Silenced         A  Bad Luck         A
  Slowed           P  Slowed           P  Rest & Remem.    P  Meteor Swarm     C
  Restoration      P  Restoration      P  Improved Haste   P  Restoration      P
  Gr. Deathblow    P  Gr. Deathblow    P  Gr. Deathblow    P  Gr. Deathblow    P
  Hardiness        P  Hardiness        P  Breach           E  Hardiness        P
  Create Wand      C  Create Wand      C  Create Wand      C  Create Wand      C
  Create Potion    C  Create Potion    C  Create Potion    C  Create Potion    C
  Breach           A  Breach           A  Breach           A  Improved Haste   P
  Wing Buffet      A  Wing Buffet      A  Wing Buffet      A  Breach           E
  Heal             A  Heal             A  Heal             A  Heal             A
  STR (18)         A  STR (18)         A  STR (18)         A  STR (18)         A
  Miscast Magic    A  Miscast Magic    A  Miscast Magic    A  Miscast Magic    A
  Magic Resist     A  Magic Resist     A  Magic Resist     A  Magic Resist     A
  Abi-Dalzim's     A  Abi-Dalzim's     A  Abi-Dalzim's     A  Abi-Dalzim's     A
  Intoxicated      A  Intoxicated      A  Intoxicated      A  Intoxicated      A
  Bad Luck         A  Bad Luck         A  Bad Luck         A
                  / Breach             E  Stats (25)       P \
              OR <                                            > OR
                  \ Rest & Remem.      P Mass Raise Dead   P /
```
 */
declare function SetupWish(column: number, count: number): void;

/**
 * 
 */
declare function SetupWishObject(creature: ObjectPtr, count: number): void;

/**
 * This action changes the current area. The active creature will move to the specified entry point (from [ENTRIES.2DA]({{ 2da }}/entries.htm)) before travelling. The action appears to only work from a creature script.
 */
declare function LeaveAreaLUAEntry(area: string, entry: string, point: Point, face: number): void;

/**
 * This multiplayer-only action changes the current area. The creature moves to the destination point (from [ENTRIES.2DA]({{ 2da }}/entries.htm)) before travelling (the point parameter is unused). Only EE games support IDS symbols for `Face`.
 */
declare function LeaveAreaLUAPanicEntry(area: string, entry: string, point: Point, face: number): void;

/**
 * This action instructs the script parser to continue looking for actions in the active creatures action list. This is mainly included in scripts for efficiency. Continue should also be appended to any script blocks added to the top of existing scripts, to ensure correct functioning of any blocks which include the OnCreation trigger. Continue may prevent actions being completed until the script parser has finished its execution cycle. Continue() must be the last command in an action list to function correctly. Use of continue in a script block will cause the parser to treater subsequent empty response blocks as though they contained a Continue() command - this parsing can be stopped by including a NoAction() in the empty response block.

```weidu-baf
  IF
    See(NearestEnemyOf())
    !InParty(NearestEnemyOf())
  THEN
    RESPONSE #100
      AttackOneRound(NearestEnemyOf())
      Continue()
  END
```
 */
declare function Continue(): void;

/**
 * This action instructs the active creature to play the swing weapon animation. Note that some objects do not have this animation.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      Swing()
  END
```
 */
declare function Swing(): void;

/**
 * This action instructs the active creature to play the recoil animation. Note that some objects do not have this animation.

```weidu-baf
  IF
    TookDamage()
  THEN
    RESPONSE #100
      Recoil()
  END
```
 */
declare function Recoil(): void;

/**
 * This action instructs the active creature to "play dead", i.e. to lay on the ground, for the specified interval (measured in AI updates per second (AI updates default to 15 per second). If used on a PC, the player can override the action by issuing a standard move command.

```weidu-baf
  IF
    HPPercentLT(Myself,30)
  THEN
    RESPONSE #100
      PlayDead(240)
  END
```
 */
declare function PlayDead(time: number): void;

/**
 * This action can used to make the active creature follow the creature specified by the leader parameter, maintain a relative position determined by the offset parameter.

```weidu-baf
  IF
    CombatCounter(0)
    Allegiance(Myself,NEUTRAL)
  THEN
    RESPONSE #100
      Formation("QSLMAGE1",[-2.-5])
  END
```
 */
declare function Formation(leader: ObjectPtr, offset: Point): void;

/**
 * This action instantly moves the active creature to the specified point.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      ClearAllActions()
      FadeToColor([20.0],0)
      MoveViewPoint([1738.543],INSTANT)
      JumpToPoint([1738.543])
      Wait(1)
      CreateVisualEffectObject("SPCLOUD1",Player1)
      Wait(1)
      CreateVisualEffectObject("SPFLESHS",Player1)
  END
```
 */
declare function JumpToPoint(target: Point): void;

/**
 * This action scrolls the view point (i.e. the area of the current map being displayed onscreen) to the target point ([x.y] at the specified speed. Speeds are taken from [scroll.ids]({{ ids }}/scroll.htm) (VERY\_FAST is equivalent to normal walking speed).
 */
declare function MoveViewPoint(target: Point, scrollspeed: number): void;

/**
 * This action scrolls the view point (i.e. the area of the current map being displayed onscreen) to the target object ([x.y] at the specified speed. Speeds are taken from [scroll.ids]({{ ids }}/scroll.htm) (VERY\_FAST is equivalent to normal walking speed). The example script is from a cutscene; CUT03C.bcs.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      CutSceneId(Player1)
      FadeToColor([20.0],0)
      Wait(1)
      ActionOverride("SPY406",DestroySelf())
      MoveViewObject(Myself,INSTANT)
      Wait(1)
      FadeFromColor([20.0],0)
      ActionOverride("cpchick1",DestroySelf())
      ActionOverride("cpchick2",DestroySelf())
      Wait(1)
      ActionOverride("Surly",StartDialogueNoSet(Player1))
  END
```
 */
declare function MoveViewObject(target: ObjectPtr, scrollspeed: number): void;

/**
 * This action changes the assigned script file for the active creature. The new script name is specified in the scriptfile parameter. The level parameter dictates the script level to change - values are from [scrlev.ids]({{ ids }}/scrlev.htm). Scripts can be set for any scriptable object (container, creature, door etc.), but are not persisted.

```weidu-baf
  IF
    See([EVILCUTOFF.0.DOG])
  THEN
    RESPONSE #100
      ChangeAIScript("DOGFIGHT",DEFAULT)
  END
```
 */
declare function ChangeAIScript(scriptfile: string, level: number): void;

/**
 * This action starts a timer local to the active creature. The timer is measured in seconds, and the timer value is not saved in save games. The timer is checked with the TimerExpired trigger.

```weidu-baf
  IF
    Global("KRDEAD","LOCALS",0 )
    Dead("Shadra01")
  THEN
    RESPONSE #100
      StartTimer("SPAWNMON",12)
      SetGlobal("KRDEAD","LOCALS",1)
  END
  
  IF
    Timer Expired("SPAWNMON")
    Global("KRDEAD","LOCALS",1)
  THEN
    RESPONSE #100
      CreateCreature("Grothgar",[700.700],0)
  END
```
 */
declare function StartTimer(id: number, time: number): void;

/**
 * This action is used as a form of script communication, in conjunction with the Trigger() trigger. The action has the same range as GiveOrder and affects only one creature at a time. Note that the LastTrigger() object does not get set after receiving a trigger.
 */
declare function SendTrigger(target: ObjectPtr, triggernum: number): void;

/**
 * This action causes a delay in script processing. The time is measured in seconds.

```weidu-baf
  IF
    See(Player1)
    See(Player6)
  THEN
    RESPONSE #100
      MoveToObject(Player1)
      Wait(2)
      MoveToObject(Player6)
      Wait(4)
  END
```
 */
declare function Wait(time: number): void;

/**
 * This action resets the fog of war for the area the active creature is in.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      UndoExplore()
  END
```
 */
declare function UndoExplore(): void;

/**
 * This action removes the fog of war for the area the active creature is in.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      Explore()
  END
```
 */
declare function Explore(): void;

/**
 * This action changes the time of day. The time parameter is taken from [time.ids]({{ ids }}/time.htm), though a direct number can be specified. The example script is from when Irenicus leaves his dungeon.

```weidu-baf
  IF
    Global("AmaWaukeen","GLOBAL",1)
  THEN
    RESPONSE #100
      DayNight(MIDNIGHT)
      SetGlobal("AmaWaukeen","GLOBAL",2)
      FadeToColor([20.0],0)
      CreateCreature("shthass1",[877.898],7)
      StartCutSceneMode()
      StartCutScene("cut24a")
  END
```
 */
declare function DayNight(timeofday: number): void;

/**
 * This action changes the weather. The action only works in outdoors areas that have weather enabled in the ARE file. Values for the weather parameter are from [weather.ids]({{ ids }}/weather.htm). Note that the fog weather type does not work.

```weidu-baf
  IF
    Global("KRSTORM","GLOBAL",0)
  THEN
    RESPONSE #100
      Weather(RAIN)
      SetGlobal("KRSTORM","GLOBAL",1)
  END
```
 */
declare function Weather(weather: number): void;

/**
 * This action calls lightning from the sky against the specified target, causing immediate death (unless the target has the MinHP effect applied). The lightning does not always show, and if it does, it is not always in the expected location.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      CutSceneId("DRUID12a")
      CallLightning("Orc05")
      CallLightning("Orc06")
  END
```
 */
declare function CallLightning(target: ObjectPtr): void;

/**
 * This action will sequentially change the visual representation of armour the active creature is wearing. The action cycles from the lowest (none) to the highest (plate mail) armour level.
 */
declare function VEquip(item: number): void;

/**
 * This action is used to create a creature - either an NPC, a neutral creature or an enemy. NewObject is the filename of the creature to create, Location is the coordinates to create the creature at ([x.y] format) and direction being the direction the creature is facing (0-15, 0 being south and the facing values increasing as the character turns clockwise). Note that a coordinate of [-1.-1] will create the creature next to the active creature.

This script is from the area script for the Copper Coronet (AR0406) and creates extra guards when the Player is discovered in the off limits area.

```weidu-baf
  IF
    Global("CopperGuards","GLOBAL",1)
  THEN
    RESPONSE #100
      CreateCreature("ccguard1",[2338.412],14)
      CreateCreature("ccguard2",[2318.457],14)
      CreateCreature("ccguard1",[2749.793],6)
      CreateCreature("ccguard2",[2791.831],6)
      CreateCreature("ccguard1",[1981.762],14)
      CreateCreature("ccguard1",[1286.1500],14)
  END
```
 */
declare function CreateCreature(newobject: string, location: Point, face: number): void;

/**
 * 
 */
declare function Dialog(object: ObjectPtr): void;

/**
 * This action instructs the active creature to initiate dialog with the target creature. Dialog will not be initiated if the creature using this action has been assigned a dialog that has all top level conditions returning false.

```weidu-baf
  IF
    GlobalTimerExpired("Yeslick","GLOBAL")
    Global("FLOODED","GLOBAL",0)
  THEN
    RESPONSE #100
      Dialogue([PC])
  END
```
 */
declare function Dialogue(object: ObjectPtr): void;

/**
 * This action creates the specified item (resref) on the active creature. The usage parameters determine the number of items created or the number of charges on the item, depending on the item type being created. The example script is from AR0602.

```weidu-baf
  IF
    Global("BG1Pantaloons","GLOBAL",0)
    PartyHasItem("MISC47")
  THEN
    RESPONSE #100
      SetGlobal("BG1Pantaloons","GLOBAL",1)
      ActionOverride("Picture1",CreateItem("MISC47",0,0,0))
      Continue()
  END
```
 */
declare function CreateItem(resref: string, usage1: number, usage2: number, usage3: number): void;

/**
 * This action is similar to [Wait()](#63), it causes a delay in script processing. The time is measured in AI updates (which default to 15 per second)

```weidu-baf
  IF
    See(NearestEnemyOf())
  THEN
    RESPONSE #100
      DisplayStingHead(Myself,50712)// Attack!! Attack!!
      SmallWait(120)
      Attack(NearestEnemyOf())
  END
```
 */
declare function SmallWait(time: number): void;

/**
 * This action instructs the active creature to face the specified direction. Directions run from 0-15 with 0 being south and moving clockwise. Negative values act as relative directions to the current direction.

```weidu-baf
  IF
    Global("BeholderBehavior","LOCALS",0)
    See([PC])
    HPGT(Myself,65)
  THEN
    RESPONSE #100
      FaceObject([PC])
      ForceSpell([PC],BEHOLDER_CHARM_PERSON)
      Continue()
  END
```
 */
declare function Face(direction: number): void;

/**
 * This action causes the active creature to walk randomly, staying within the current area. The example script is blbear.bcs; it instructs bears to walk rather than fight if the nearest enemy is a druid.

```weidu-baf
  IF
    Delay(5)
    See(NearestEnemyOf(Myself))
    Class(NearestEnemyOf(Myself),DRUID)
    NumCreatureGT([ENEMY],1)
  THEN
    RESPONSE #100
      RandomWalk()
  END
```
{% capture note %}
* This action will never stop, (unless interrupted in specific situations), and thus never leave the action list.
* Executes [Wait()](#63) for a random amount of time, (1–40 seconds), if the creature goes off-screen.
* Has a 50/50 chance to [MoveToPoint()](#23), or do a pass of [RandomTurn()](#130), (including [RandomTurn()](#130)'s wait time).

{% endcapture %} {% include note.html %}
 */
declare function RandomWalk(): void;

/**
 * This action sets whether a creature can be interrupted while carrying out script actions.

```weidu-baf
  IF
    See(Player2)
    !Range(Player2,4)
  THEN
    RESPONSE #100
      SetInterrupt(FALSE)
      MoveToObject("Player2")
      SetInterrupt (TRUE)
  END
```
 */
declare function SetInterrupt(state: number): void;

/**
 * This action instructs the active creature to protect the specified creature (i.e. attack any enemies of the creature), while staying within the specified range. The example script is from IWD, 4003bsg.bcs and controls the zombies guarding Presio.(4003BSG.bcs).

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      ProtectObject("Presio",100)
  END
```
 */
declare function ProtectObject(target: ObjectPtr, range: number): void;

/**
 * This action instructs the active creature to move to the specified point and marks the creature as a leader. The following example script sets Player1 walking to [3363.2954] and sets Player2 and Player3 to "follow" to [3363.2954] in a line and with minimal walking into each other. This action is not fully understood, and is not particularly reliable.

```weidu-baf
  IF
    HotKey(E)
  THEN
    RESPONSE #100
      ActionOverride(Player1,Leader([3363.2954]))
      ActionOverride(Player2,Follow([3363.2954]))
      ActionOverride(Player3,Follow([3363.2954]))
  END
```
 */
declare function Leader(point: Point): void;

/**
 * This action instructs the active creature to move to the specified point following the marked Leader.
 */
declare function Follow(point: Point): void;

/**
 * This action instructs the active creature to drop the specified item at the specified location (relative to the active creature). The active creature must have the item to be dropped. Note that a coordinate of [-1.-1] will drop the item next to the active creature.

```weidu-baf
  IF
    Clicked([ANYONE])
    Range(LastTrigger,12)
  THEN
    RESPONSE #100
      DropItem("SCRL1B",[345.1210])
  END
```
 */
declare function DropItem(object: string, location: Point): void;

/**
 * This action instructs the active creature to leave the current area.
 */
declare function LeaveArea(area: string, point: Point, face: number): void;

/**
 * This action instructs the active creature to select the specified slot, and use the ability in the extended header specified by the ability parameter. The example script is from ankheg.bcs.

```weidu-baf
  IF
    See(NearestEnemyOf(Myself))
    Range(NearestEnemyOf(Myself),5)
    Delay(12)
  THEN
    RESPONSE #40
      SelectWeaponAbility(SLOT_WEAPON,0)
      RunAwayFrom(NearestEnemyOf(Myself),45)
      AttackReevaluate(NearestEnemyOf(Myself),15)
    RESPONSE #60
      SelectWeaponAbility(SLOT_WEAPON1,0)
      AttackReevaluate(NearestEnemyOf(Myself),15)
  END
```
 */
declare function SelectWeaponAbility(weaponnum: number, abilitynum: number): void;

/**
 * The signature of this action is not listed in the action.ids file provided with the game. This action causes the active creature to leave the area using the trigger region identified by the specified parameter. The parameter is the internal global ID of the region.
 */
declare function LeaveAreaName(target: number): void;

/**
 * This action instructs the active creature to attack creatures with the same specific value as the target creature.
 */
declare function GroupAttack(target: ObjectPtr): void;

/**
 * 
 */
declare function SpellPointRES(res: string, target: Point): void;

/**
 * This action causes the active creature to cast the specified spell at the specified point ([x.y]). The spell must currently be memorised by the caster, and may be interrupted while being cast. The caster must meet the level requirements of the spell. For the RES version of the action, the spell name can not consist of only numbers, should be written in upper case and should be no more than 7 characters long. The example script is from `"andris.bcs"`.

```weidu-baf
  IF
    Global("AndrisBehavior","AR1009",0)
    See(NearestEnemyOf(Myself))
  THEN
    RESPONSE #100
      ForceSpellPoint([2002.1554],WIZARD_DIMENSION_DOOR)
      Wait(1)
      SpellNoDec(NearestEnemyOf(Myself),WIZARD_CONFUSION)
      SetGlobal("AndrisBehavior","AR1009",1)
  END
```

{% capture note %}
Scripts can handle `RES` filenames with `+`, Dialogs and the console cannot. Same with the `~`, `` ` ``, `'`, `@`, `$`, `^`, and `&` characters, maybe some more.
- This action will default to a spell matching the first 7 characters in Dialogs/Console *IF* the 8<sup>th</sup> character isn't valid.
{% endcapture %} {% include note.html %}
 */
declare function SpellPoint(target: Point, spell: number): void;

/**
 * This action applies the benefits of resting (i.e. healing, restoring spells and restoring abilities) to the active creature. The action does not play the rest movie or advance game time. The example script is from cut28a.bcs.

```weidu-baf
  IF
    True()
  THEN
    RESPONSE #100
      CutSceneId(Player1)
      StorePartyLocations()
      FadeToColor([30.0],0)
      Wait(1)
      Rest()
      ActionOverride(Player2,Rest())
      ActionOverride(Player3,Rest())
      ActionOverride(Player4,Rest())
      ActionOverride(Player5,Rest())
      ActionOverride(Player6,Rest())
  (cut short for brevity)
```
 */
declare function Rest(): void;

/**
 * This action instructs the active creature to attack the target, without sounding a battlecry.
 */
declare function AttackNoSound(target: ObjectPtr): void;