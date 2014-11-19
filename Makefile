test:
	@node node_modules/lab/bin/lab -a code
test-tap:
	@node node_modules/lab/bin/lab -a code -r tap -o tests.tap
test-cov:
	@node node_modules/lab/bin/lab -a code -t 100 -L
test-cov-html:
	@node node_modules/lab/bin/lab -a code -r html -o coverage.html

.PHONY: test test-cov test-cov-html changelog
