// Let's set a variable for each valid entry in ALIGN.IDS

FOR (i = 1; i < 0x40; ++i) BEGIN // Let's skip 0 // NONE...
	LOOKUP_IDS_SYMBOL_OF_INT align_name ~ALIGN~ i
	PATCH_IF !(IS_AN_INT ~%align_name%~) BEGIN
		TEXT_SPRINT EVAL "%align_name%" "%i%"
	END
END
