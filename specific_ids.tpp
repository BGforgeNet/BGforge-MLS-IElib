// Let's set a variable for each valid entry in SPECIFIC.IDS

FOR (i = 0; i < 256; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT specific_name ~SPECIFIC~ i
	PATCH_IF !(IS_AN_INT ~%specific_name%~) BEGIN
		TEXT_SPRINT EVAL "%specific_name%" "%i%"
	END
END
