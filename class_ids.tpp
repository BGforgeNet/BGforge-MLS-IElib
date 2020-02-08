// Let's set a variable for each valid entry in CLASS.IDS

FOR (i = 0; i < 256; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT class_name ~CLASS~ i
	PATCH_IF !(IS_AN_INT ~%class_name%~) BEGIN
		TEXT_SPRINT EVAL "%class_name%" "%i%"
	END
END
