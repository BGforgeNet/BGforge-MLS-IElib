// Let's set a variable for each valid entry in EA.IDS

FOR (i = 0; i < 256; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT ea_name ~EA~ i
	PATCH_IF !(IS_AN_INT ~%ea_name%~) BEGIN
		TEXT_SPRINT EVAL "%ea_name%" "%i%"
	END
END
