// Let's set a variable for each valid entry in GENDER.IDS

FOR (i = 0; i < 256; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT gender_name ~GENDER~ i
	PATCH_IF !(IS_AN_INT ~%gender_name%~) BEGIN
		TEXT_SPRINT EVAL "%gender_name%" "%i%"
	END
END
