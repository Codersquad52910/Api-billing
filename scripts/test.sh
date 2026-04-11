#!/bin/bash
# ============================================================
# API Billing Platform — Test Runner
# ============================================================
# Runs all project validation tests:
#   1. Backend JavaScript syntax validation (node --check)
#   2. Backend module structure verification
#   3. Frontend build verification
# ============================================================

set -e

echo "================================================"
echo "🧪 API Billing Platform — Test Suite"
echo "================================================"
echo ""

PASS=0
FAIL=0

# ── Test 1: Backend Syntax Validation ────────────────────────
echo "── Test 1: Backend Syntax Validation ──────────────"
for file in $(find backend -name "*.js" -not -path "*/node_modules/*"); do
  if node --check "$file" 2>/dev/null; then
    echo "  ✅ $file"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $file"
    FAIL=$((FAIL + 1))
  fi
done
echo ""

# ── Test 2: Backend Module Structure ─────────────────────────
echo "── Test 2: Backend Module Structure ───────────────"

required_files=(
  "backend/server.js"
  "backend/config/db.js"
  "backend/routes/authRoutes.js"
  "backend/routes/apiRoutes.js"
  "backend/routes/usageRoutes.js"
  "backend/routes/adminRoutes.js"
  "backend/routes/serviceRoutes.js"
  "backend/middleware/authMiddleware.js"
  "backend/middleware/apiMiddleware.js"
  "backend/models/User.js"
  "backend/models/APIKey.js"
  "backend/models/Service.js"
  "backend/models/Usage.js"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file exists"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $file MISSING"
    FAIL=$((FAIL + 1))
  fi
done
echo ""

# ── Test 3: Package.json Validation ──────────────────────────
echo "── Test 3: Package.json Validation ────────────────"

packages=("package.json" "backend/package.json" "frontend/package.json" "admin-frontend/package.json")

for pkg in "${packages[@]}"; do
  if node -e "JSON.parse(require('fs').readFileSync('$pkg', 'utf8'))" 2>/dev/null; then
    echo "  ✅ $pkg is valid JSON"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $pkg is invalid JSON"
    FAIL=$((FAIL + 1))
  fi
done
echo ""

# ── Test 4: Environment Configuration ───────────────────────
echo "── Test 4: Environment Configuration ──────────────"

if [ -f "backend/.env.example" ]; then
  echo "  ✅ .env.example template exists"
  PASS=$((PASS + 1))
else
  echo "  ❌ .env.example template MISSING"
  FAIL=$((FAIL + 1))
fi

if [ ! -f "backend/.env" ] || ! git ls-files --error-unmatch backend/.env 2>/dev/null; then
  echo "  ✅ .env is not tracked by git (secrets safe)"
  PASS=$((PASS + 1))
else
  echo "  ❌ .env is tracked by git (SECURITY RISK)"
  FAIL=$((FAIL + 1))
fi
echo ""

# ── Test 5: Docker Configuration ────────────────────────────
echo "── Test 5: Docker Configuration ───────────────────"

docker_files=("Dockerfile" ".dockerignore" "docker-compose.yml")

for dfile in "${docker_files[@]}"; do
  if [ -f "$dfile" ]; then
    echo "  ✅ $dfile exists"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $dfile MISSING"
    FAIL=$((FAIL + 1))
  fi
done
echo ""

# ── Summary ──────────────────────────────────────────────────
echo "================================================"
echo "📊 Test Results: $PASS passed, $FAIL failed"
echo "================================================"

if [ $FAIL -gt 0 ]; then
  echo "❌ SOME TESTS FAILED"
  exit 1
else
  echo "✅ ALL TESTS PASSED"
  exit 0
fi
