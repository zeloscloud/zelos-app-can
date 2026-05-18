# Install dependencies
install:
    npm ci

# Run development server
dev:
    npm run dev

# Format code (Prettier)
format:
    npm run format

# Run tests
test:
    npm run test

# Run tests in watch mode
test-watch:
    npm run test:watch

# Type-check
tsc:
    npm run tsc

# Lint
lint:
    npm run lint

# Lint and type-check
check:
    npm run check

# Build for production
build:
    npm run build

# Package for Zelos marketplace
package:
    npm run build
    npm run package

# Run all CI checks
ci:
    npm ci
    npm run format:check
    npm run check
    npm test
    npm run build
    npm run package

# Release: bump version, check, build, commit, tag
release VERSION:
    #!/usr/bin/env bash
    set -eux -o pipefail
    git diff-index --quiet HEAD || (echo "Uncommitted changes! Commit or stash first." && exit 1)
    zelos extensions bump "{{VERSION}}"
    just format
    just check
    just build
    git add -A
    git commit -m "Release v{{VERSION}}"
    git tag -a "v{{VERSION}}" -m "Release v{{VERSION}}"
    echo ""
    echo "✓ Release v{{VERSION}} ready!"
    echo ""
    echo "Push with: git push --follow-tags"

# Delete a GitHub release, its remote+local tag, and force-push
delete-release VERSION:
    #!/usr/bin/env bash
    set -euo pipefail
    tag="v{{VERSION}}"
    gh release delete "$tag" --yes 2>/dev/null && echo "✓ release deleted" || echo "- no release found"
    git push origin --delete "$tag" 2>/dev/null && echo "✓ remote tag deleted" || echo "- no remote tag"
    git tag -d "$tag" 2>/dev/null && echo "✓ local tag deleted" || echo "- no local tag"
    git push --force-with-lease
    echo ""
    echo "✓ Cleaned up $tag — ready to re-release"

# Remove build artifacts
clean:
    rm -rf dist node_modules *.tar.gz
