// Let's set a variable for each valid entry in SPLSTATE.IDS

FOR (i = 0; i < 256; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT splstate_name ~SPLSTATE~ i
	PATCH_IF !(IS_AN_INT ~%splstate_name%~) BEGIN
		TEXT_SPRINT EVAL "%splstate_name%" "%i%"
	END
END
