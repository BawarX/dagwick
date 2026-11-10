#!/bin/bash -eu
# Build every fuzz/fuzz_*.py target. Dagwick has no runtime dependencies and the
# targets do not need Airflow, so nothing is installed: PyInstaller reads the
# package straight from src/.
for fuzzer in "$SRC"/dagwick/fuzz/fuzz_*.py; do
  compile_python_fuzzer "$fuzzer" --paths "$SRC/dagwick/src" --collect-submodules dagwick
done
