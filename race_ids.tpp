// Let's set a variable for each valid entry in RACE.IDS

FOR (i = 0; i < 256; ++i) BEGIN
	LOOKUP_IDS_SYMBOL_OF_INT race_name ~RACE~ i
	PATCH_IF !(IS_AN_INT ~%race_name%~) BEGIN
		TEXT_SPRINT EVAL "%race_name%" "%i%"
	END
END
