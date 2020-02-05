// Let's set a variable for each valid entry in SPELL.IDS
// You can now write ADD_MEMORIZED_SPELL ~%cleric_bless%~ instead of ADD_MEMORIZED_SPELL ~SPPR101~

FOR (i = 1000; i < 5000; ++i) BEGIN
	INNER_ACTION BEGIN
		LAF RES_NAME_OF_SPELL_NUM
		INT_VAR
			spell_num = i
		RET
			spell_res
			spell_name
		END
	END
	PATCH_IF (FILE_EXISTS_IN_GAME ~%spell_res%.spl~) BEGIN
		PATCH_IF !(IS_AN_INT ~%spell_name%~) BEGIN	// For instance, SPCL643 exists in BG:EE but does not have a symbolic reference...
			TEXT_SPRINT EVAL ~%spell_name%~ ~%spell_res%~
		END
	END
END
