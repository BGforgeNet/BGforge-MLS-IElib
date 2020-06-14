ITM_replacement_item = 0x10
ITM_flags = 0x18
ITM_type = 0x1c
ITM_usability_flags = 0x1e
ITM_animation = 0x22
ITM_min_level = 0x24
ITM_min_strength = 0x26
ITM_min_strength_bonus = 0x28
ITM_kit_usability_1 = 0x29
ITM_min_intelligencs = 0x2a
ITM_kit_usability_2 = 0x2b
ITM_min_dexterity = 0x2c
ITM_kit_usability_3 = 0x2d
ITM_min_wisdom = 0x2e
ITM_kit_usability_3 = 0x2f
ITM_min_constitution = 0x30
ITM_weapon_proficiency = 0x31
ITM_min_charisma = 0x32
ITM_price = 0x34
ITM_stack_amount = 0x38
ITM_inventory_icon = 0x3a
ITM_lore_to_id = 0x42
ITM_ground_icon = 0x44
ITM_weight = 0x4c
ITM_description_icon = 0x58
ITM_enchantment = 0x60
ITM_extended_headers_offset = 0x64
ITM_extended_headers_count = 0x68
ITM_feature_blocks_offset = 0x6a
ITM_equipping_feature_blocks_index = 0x6e
ITM_equipping_feature_blocks_count = 0x70

PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/depletion.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/flag_itm_header.tpp~
PATCH_INCLUDE ~%BGFORGE_LIB_DIR%/itm_type.tpp~
