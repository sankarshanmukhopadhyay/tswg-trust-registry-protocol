#!/bin/bash
# Renders the retained approved v2 baseline and the downstream v3 candidate.
# On the v3 product branch, the root publication surface points to candidate v3;
# approved v2 remains available as retained provenance/migration baseline.

set -e

bash ./move_images.sh

# Render retained approved v2 baseline.
echo "=== Rendering retained approved v2 baseline ==="
node -e "require('spec-up')({ nowatch: true })"

# Render downstream v3 candidate, then restore the approved-v2 config.
echo "=== Rendering downstream v3 candidate ==="
cp specs.json specs-approved.json
cp specs-draft.json specs.json
node -e "require('spec-up')({ nowatch: true })"
cp specs-approved.json specs.json
rm specs-approved.json

# The candidate product branch publishes v3 as its default surface.
cat > ./dist/index.html << 'REDIRECT'
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=candidate-v3/">
  <title>TRQP v3 downstream candidate</title>
</head>
<body>
  <p>Redirecting to the <a href="candidate-v3/">TRQP v3 downstream candidate</a>.</p>
  <p>The retained approved v2 baseline remains available at <a href="approved/">approved/</a>.</p>
</body>
</html>
REDIRECT

echo "=== Done. Output: dist/candidate-v3/index.html (default) and dist/approved/index.html (retained v2) ==="
