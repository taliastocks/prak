export BUILDDIR:=$(CURDIR)/build
export SRCDIR:=$(CURDIR)/src

export CC:=gcc --std=c11


build:
	@mkdir -p "$(BUILDDIR)"
	@cd "$(SRCDIR)" && $(MAKE)


publish:
	npm publish


clean:
	@rm -rf "$(BUILDDIR)"


.PHONY: build clean publish
