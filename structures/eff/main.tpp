// effects/feature blocks are the same in itm and spl

TARGET_EFF_none = 0
TARGET_EFF_self = 1
TARGET_EFF_preset = 2
TARGET_EFF_party = 3
TARGET_EFF_everyone = 4
TARGET_EFF_everyone_except_party = 5
TARGET_EFF_everyone_match_specific_caster = 6
TARGET_EFF_everyone_match_specific_target = 7
TARGET_EFF_everyone_except_self = 8
TARGET_EFF_original_caster = 9

EFF_opcode = 0
EFF_target = 0x2
EFF_power = 0x3
EFF_parameter1 = 0x4
EFF_parameter2 = 0x8
EFF_duration = 0xe
EFF_probability1 = 0x12
EFF_probability2 = 0x13
EFF_resource = 0x14
EFF_dicenum = 0x1c
EFF_dicesize = 0x20
EFF_savingthrow = 0x24
EFF_savingthrow_bonus = 0x28
EFF_tobex_stacking_id = 0x2c


TEXT_SPRINT BGFORGE_EFF_DIR ~%BGFORGE_STRUCTURES_DIR%/EFF~
PATCH_INCLUDE
  ~%BGFORGE_EFF_DIR%/resist_dispel.tpp~
  ~%BGFORGE_EFF_DIR%/timing.tpp~
  ~%BGFORGE_EFF_DIR%/flag_saving_throw.tpp~
