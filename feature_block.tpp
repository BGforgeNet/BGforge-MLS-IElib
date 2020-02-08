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

PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/resist_dispel.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/timing.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/savingthrow.tpp~
