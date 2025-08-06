#!/bin/bash
echo "Auto-fixing pre-commit issues..."
pre-commit run trailing-whitespace --all-files || true
pre-commit run end-of-file-fixer --all-files || true
git add . && git commit -m "Auto-fix formatting issues" || echo "No changes to commit"
echo "Running final scan..."
pre-commit run --all-files
