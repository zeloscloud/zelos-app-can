package:
    zelos extensions package .

install-local:
    zelos extensions install .

release VERSION:
    #!/usr/bin/env bash
    set -eux -o pipefail
    git diff-index --quiet HEAD || (echo "Uncommitted changes! Commit or stash first." && exit 1)
    zelos extensions bump "{{VERSION}}"
    git add -A
    git commit -m "Release v{{VERSION}}"
    git tag -a "v{{VERSION}}" -m "Release v{{VERSION}}"
    echo "✓ Release v{{VERSION}} ready. Push with: git push --follow-tags"
