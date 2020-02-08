// Let's set a variable for each valid entry in KIT.IDS

FOR (i = 0x0040; i < 0x80000000; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT kit_name ~KIT~ i
	PATCH_IF !(IS_AN_INT ~%kit_name%~) BEGIN
		TEXT_SPRINT EVAL "%kit_name%" "%i%"
	END
END
