// Let's set a variable for each valid entry in ANIMATE.IDS

FOR (i = 0; i < 0xFFFF; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT animate_name ~ANIMATE~ i
	PATCH_IF !(IS_AN_INT ~%animate_name%~) BEGIN
		TEXT_SPRINT EVAL "%animate_name%" "%i%"
	END
END
