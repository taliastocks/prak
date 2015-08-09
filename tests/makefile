.PHONY: test
test: test_lex_valid


.PHONY: test_lex_valid
test_lex_valid:
	@cat "$(TESTDIR)/lex_valid_input.txt" | "$(BUILDDIR)/lex" | diff --brief - "$(TESTDIR)/lex_valid_output.txt"
