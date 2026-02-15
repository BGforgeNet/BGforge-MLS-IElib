import type { Action, ObjectPtr } from "../index";

// Help() is both Action and Trigger. Exported separately since it can't
// live in either actions.d.ts or triggers.d.ts without conflicting overloads.

/**
 * This action acts similar to shout, but does not accept values. The range of the Help action is slightly larger than the default visual radius of NPCs.

```weidu-baf
  IF
    HitBy([ANYONE],CRUSHING)
  THEN
    RESPONSE #50
      Help()
      Attack(NearestEnemyOf(Myself))
    RESPONSE #50
      RunAwayFrom(NearestEnemyOf(Myself),75)
  END

  IF
    Help([0.0.GIBBERLING])
  THEN
    RESPONSE #100
      Attack(NearestEnemyOf(LastHelp(Myself)))
  END

  IF
    See(NearestEnemyOf(Myself))
  THEN
    RESPONSE #100
      Help()
      AttackReevaluate(NearestEnemyOf(Myself),30)
  END
```
 */
export declare function Help(): Action;

/**
 * Returns true if the specified object shouted for Help() in the two script rounds. Help() has a range of approximately 40.
 * @param who ObjectPtr
*/
export declare function Help(who: ObjectPtr): boolean;
