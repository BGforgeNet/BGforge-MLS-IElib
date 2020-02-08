// Let's set a variable for each valid entry in GENERAL.IDS

FOR (i = 0; i < 256; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT general_name ~GENERAL~ i
	PATCH_IF !(IS_AN_INT ~%general_name%~) BEGIN
		TEXT_SPRINT EVAL "%general_name%" "%i%"
	END
END
