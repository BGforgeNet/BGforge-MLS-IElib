// feature blocks are the same in itm and spl

TARGET_EFFECT_none = 0
TARGET_EFFECT_self = 1
TARGET_EFFECT_preset = 2
TARGET_EFFECT_party = 3
TARGET_EFFECT_everyone = 4
TARGET_EFFECT_everyone_except_party = 5
TARGET_EFFECT_everyone_match_specific_caster = 6
TARGET_EFFECT_everyone_match_specific_target = 7
TARGET_EFFECT_everyone_except_self = 8
TARGET_EFFECT_original_caster = 9

EFFECT_opcode = 0
EFFECT_target = 0x2
EFFECT_power = 0x3
EFFECT_parameter1 = 0x4
EFFECT_parameter2 = 0x8
EFFECT_duration = 0xe
EFFECT_probability1 = 0x12
EFFECT_probability2 = 0x13
EFFECT_resource = 0x14
EFFECT_dicenum = 0x1c
EFFECT_dicesize = 0x20
EFFECT_savingthrow = 0x24
EFFECT_savingthrow_bonus = 0x28
EFFECT_tobex_stacking_id = 0x2c


TEXT_SPRINT BGFORGE_EFFECT_DIR ~%BGFORGE_STRUCTURES_DIR%/effect~
PATCH_INCLUDE
  ~%BGFORGE_EFFECT_DIR%/depletion.tpp~
  ~%BGFORGE_EFFECT_DIR%/resist_dispel.tpp~
  ~%BGFORGE_EFFECT_DIR%/timing.tpp~
  ~%BGFORGE_EFFECT_DIR%/flag_saving_throw.tpp~
