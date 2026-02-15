import { Action, ObjectPtr } from '..';

export * from './actions';
export * from './align.ids';
export * from './animate.ids';
export * from './areaflag.ids';
export * from './areatype.ids';
export * from './astyles.ids';
export * from './class.ids';
export * from './damages.ids';
export * from './dir.ids';
export * from './difflev.ids';
export * from './dmgtype.ids';
export * from './ea.ids';
export * from './gender.ids';
export * from './general.ids';
export * from './gtimes.ids';
export * from './happy.ids';
export * from './hotkey.ids';
export * from './jourtype.ids';
export * from './kit.ids';
export * from './mflags.ids';
export * from './modal.ids';
export * from './npc.ids';

export * from './object.d';
export * from './object';

export * from './race.ids';
export * from './reaction.ids';
export * from './scrlev.ids';
export * from './scroll.ids';
export * from './seq.ids';
export * from './shoutids.ids';
export * from './slots.ids';
export * from './sndslot.ids';
export * from './soundoff.ids';
export * from './specific.ids';
export * from './spell.ids';
export * from './state.ids';
export * from './stats.ids';
export * from './time.ids';
export * from './timeoday.ids';

export * from './triggers';

export * from './weather.ids';

// Help() is both Action and Trigger. Exporting explicitly.

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
