#!/bin/bash
set -e

echo "🔒 Setting up repository security..."

# Install pre-commit if not present
if ! command -v pre-commit &> /dev/null; then
    echo "Installing pre-commit..."
    pip3 install pre-commit
fi

# Install gitleaks if not present
if ! command -v gitleaks &> /dev/null; then
    echo "Installing gitleaks..."
    if command -v brew &> /dev/null; then
        brew install gitleaks
    else
        echo "Please install gitleaks manually"
    fi
fi

# Install hooks
pre-commit install --hook-type pre-commit
pre-commit install --hook-type pre-push

# Create baseline
pip3 install detect-secrets
detect-secrets scan --baseline .secrets.baseline

# Run initial scan
echo "Running initial security scan..."
pre-commit run --all-files

echo "✅ Security setup complete!"
