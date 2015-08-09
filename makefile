export BUILDDIR:=$(CURDIR)/build
export TESTDIR:=$(CURDIR)/tests
export SRCDIR:=$(CURDIR)/src

export CC:=gcc --std=c11


build:
	@mkdir -p "$(BUILDDIR)"
	@cd "$(SRCDIR)" && $(MAKE)


publish:
	npm publish


test: build
	@cd "$(TESTDIR)" && $(MAKE) test
	@echo "Tests passed."


clean:
	@rm -rf "$(BUILDDIR)"


.PHONY: build clean publish test
