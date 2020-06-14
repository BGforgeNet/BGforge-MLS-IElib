SPL_completion_sound = 0x10
SPL_flags = 0x18
SPL_type = 0x1c
SPL_exclusion_flags = 0x1e
SPL_casting_graphics = 0x22
SPL_type = 0x25
SPL_sectype = 0x27
SPL_level = 0x34
SPL_icon = 0x3a
SPL_desc = 0x50
SPL_desc_unidentified = 0x54
SPL_ext_header_offset = 0x64
SPL_ext_header_count = 0x68
SPL_feature_block_offset = 0x6a
SPL_casting_feature_block_offset = 0x6e
SPL_casting_feature_block_count = 0x70

PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/flag_spl.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/spl_header.tpp~
