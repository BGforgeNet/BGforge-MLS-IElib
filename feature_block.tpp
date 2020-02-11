// feature blocks are the same in itm and spl

TARGET_FEATURE_none = 0
TARGET_FEATURE_self = 1
TARGET_FEATURE_preset = 2
TARGET_FEATURE_party = 3
TARGET_FEATURE_everyone = 4
TARGET_FEATURE_everyone_except_party = 5
TARGET_FEATURE_everyone_match_specific_caster = 6
TARGET_FEATURE_everyone_match_specific_target = 7
TARGET_FEATURE_everyone_except_self = 8
TARGET_FEATURE_original_caster = 9

FEATURE_opcode = 0
FEATURE_target = 0x2
FEATURE_power = 0x3
FEATURE_parameter1 = 0x4
FEATURE_parameter2 = 0x8
FEATURE_duration = 0xe
FEATURE_probability1 = 0x12
FEATURE_probability2 = 0x13
FEATURE_resource = 0x14
FEATURE_dicenum = 0x1c
FEATURE_dicesize = 0x20
FEATURE_savingthrow = 0x24
FEATURE_savingthrow_bonus = 0x28

PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/resist_dispel.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/timing.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/savingthrow.tpp~
