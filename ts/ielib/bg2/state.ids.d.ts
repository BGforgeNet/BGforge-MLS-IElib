import type { IE } from "../index";

/** State.ids */
export declare type State = IE<number, "State">;

/** 0x00000000 */
export declare const STATE_NORMAL: State;

/** 0x800 */
export declare const STATE_DEAD: State;

/** 0x400 - Unknown. This state is not set by the death effect.  */
export declare const STATE_ACID_DEATH: State;

/** 0x200 - Unknown. This state is not set by the death effect. The creature seems to be shaded dark red until hit.  */
export declare const STATE_FLAME_DEATH: State;

/** 0x100 - Unknown. This state is not set by the death effect.  */
export declare const STATE_EXPLODING_DEATH: State;

/** 0x80 */
export declare const STATE_STONE_DEATH: State;

/** 0x40 */
export declare const STATE_FROZEN_DEATH: State;

/** 0x20 */
export declare const STATE_HELPLESS: State;

/** 0x10 - Unknown. This state is not set by the invisibility effect.  */
export declare const STATE_INVISIBLE: State;

/** 0x8 - Unknown. This state is not set by the stunned effect.  */
export declare const STATE_STUNNED: State;

/** 0x4 - This state seems to apply only to creatures that are affected by panic inducing magic. Creatures that fail their Morale check are not in this state.  */
export declare const STATE_PANIC: State;

/** 0x2 */
export declare const STATE_BERSERK: State;

/** 0x1 */
export declare const STATE_SLEEPING: State;

/** 0x1000 */
export declare const STATE_SILENCED: State;

/** 0x2000 */
export declare const STATE_CHARMED: State;

/** 0x4000 */
export declare const STATE_POISONED: State;

/** 0x8000 */
export declare const STATE_HASTED: State;

/** 0x10000 */
export declare const STATE_SLOWED: State;

/** 0x20000 */
export declare const STATE_INFRAVISION: State;

/** 0x40000 - This state indicates whether the creature is currently blinded.  */
export declare const STATE_BLIND: State;

/** 0x80000 - This state indicates whether the creature is "active" (as set by Activate/Deactivate actions).  */
export declare const STATE_DISEASED: State;

/** 0x100000 */
export declare const STATE_FEEBLEMINDED: State;

/** 0x200000 */
export declare const STATE_NONDETECTION: State;

/** 0x400000 */
export declare const STATE_IMPROVEDINVISIBILITY: State;

/** 0x800000 */
export declare const STATE_BLESS: State;

/** 0x1000000 */
export declare const STATE_CHANT: State;

/** 0x2000000 */
export declare const STATE_DRAWUPONHOLYMIGHT: State;

/** 0x4000000 */
export declare const STATE_LUCK: State;

/** 0x8000000 */
export declare const STATE_AID: State;

/** 0x10000000 */
export declare const STATE_CHANTBAD: State;

/** 0x20000000 - Unknown. This state is not set by the Blur effect.  */
export declare const STATE_BLUR: State;

/** 0x40000000 - Unknown. This state is not set by the Mirror Image effect.  */
export declare const STATE_MIRRORIMAGE: State;

/** 0x80000000 - Common shortcut states include: */
export declare const STATE_CONFUSED: State;

/** 0x00102029 - Feeblemind & Charmed & Helpless & Stunned & Sleeping  */
export declare const STATE_HARMLESS: State;

/** 0x80040004 - Blind & Confused & Panic  */
export declare const STATE_RANGED_TARGET: State;

/** 0x8014202D - Feeblemind & Charmed & Helpless & Stunned & Sleeping & Blind & Confused & Panic  */
export declare const STATE_OUT_OF_ACTION: State;

/** 0x00400010 - Invisibility & Improved Invisibility  */
export declare const STATE_NOT_VISIBLE: State;

/** 0x63C08010 - Mirror Image & Chant & Haste & Aid & Improved Invisibility  */
export declare const STATE_ENCHANTED: State;

/** 0x60400010 - Invisible & Improved Invisibility & Mirror Image  */
export declare const STATE_ILLUSIONS: State;

/** 0x8000380F - Confused & Charmed & Silenced & Dead & Stunned & Panic & Berserk & Sleeping */
export declare const STATE_INVALID: State;
