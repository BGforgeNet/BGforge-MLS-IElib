TEXT_SPRINT BGFORGE_MISC_DIR ~%BGFORGE_LIB_DIR%/misc~

PATCH_IF (GAME_IS ~BG2 TOB BGEE BG2EE~) BEGIN PATCH_INCLUDE ~%BGFORGE_MISC_DIR%/scrolls.tpp~ END
PATCH_IF (GAME_IS ~IWDEE~) BEGIN PATCH_INCLUDE ~%BGFORGE_MISC_DIR%/scrolls_iwdee.tpp~ END
