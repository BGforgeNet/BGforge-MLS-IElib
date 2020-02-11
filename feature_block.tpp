// feature blocks are the same in itm and spl

TARGET_FB_none = 0
TARGET_FB_self = 1
TARGET_FB_preset = 2
TARGET_FB_party = 3
TARGET_FB_everyone = 4
TARGET_FB_everyone_except_party = 5
TARGET_FB_everyone_match_specific_caster = 6
TARGET_FB_everyone_match_specific_target = 7
TARGET_FB_everyone_except_self = 8
TARGET_FB_original_caster = 9

OFFSET_power = 0x3
OFFSET_parameter1 = 0x4
OFFSET_parameter2 = 0x8
OFFSET_duration = 0xe
OFFSET_probability1 = 0x12
OFFSET_probability2 = 0x13
OFFSET_resource = 0x14
OFFSET_dicenum = 0x1c
OFFSET_dicesize = 0x20
OFFSET_savingthrow = 0x24
OFFSET_savingthrow_bonus = 0x28

PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/resist_dispel.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/timing.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/savingthrow.tpp~
