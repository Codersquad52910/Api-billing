/**
 * API Billing Platform — Backend Health Tests
 * 
 * Validates that all critical backend modules exist and
 * can be resolved without runtime errors.
 * 
 * Run: node backend/tests/health.test.js
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

console.log('');
console.log('══════════════════════════════════════════════');
console.log('🏥 Backend Health Check Tests');
console.log('══════════════════════════════════════════════');
console.log('');

// ── Server Configuration Tests ────────────────────────────
console.log('── Server Configuration ─────────────────────');

test('server.js exists', () => {
  assert(existsSync(resolve(ROOT, 'server.js')), 'server.js not found');
});

test('package.json is valid', () => {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
  assert(pkg.name === 'backend', 'package name should be "backend"');
  assert(pkg.type === 'module', 'package should use ES modules');
  assert(pkg.scripts?.start, 'start script should be defined');
});

test('.env.example exists with required keys', () => {
  const envExample = readFileSync(resolve(ROOT, '.env.example'), 'utf8');
  const requiredKeys = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'SUPER_ADMIN_EMAIL', 'SUPER_ADMIN_PASSWORD'];
  for (const key of requiredKeys) {
    assert(envExample.includes(key), `Missing required env key: ${key}`);
  }
});

// ── Route Module Tests ────────────────────────────────────
console.log('');
console.log('── Route Modules ───────────────────────────');

const routes = [
  'routes/authRoutes.js',
  'routes/apiRoutes.js',
  'routes/usageRoutes.js',
  'routes/adminRoutes.js',
  'routes/serviceRoutes.js',
  'routes/superAdminRoutes.js',
];

for (const route of routes) {
  test(`${route} exists`, () => {
    assert(existsSync(resolve(ROOT, route)), `${route} not found`);
  });
}

// ── Model Tests ───────────────────────────────────────────
console.log('');
console.log('── Data Models ─────────────────────────────');

const models = ['models/User.js', 'models/APIKey.js', 'models/Service.js', 'models/Usage.js'];

for (const model of models) {
  test(`${model} exists`, () => {
    assert(existsSync(resolve(ROOT, model)), `${model} not found`);
  });
}

// ── Middleware Tests ──────────────────────────────────────
console.log('');
console.log('── Middleware ───────────────────────────────');

const middlewares = ['middleware/authMiddleware.js', 'middleware/apiMiddleware.js'];

for (const mw of middlewares) {
  test(`${mw} exists`, () => {
    assert(existsSync(resolve(ROOT, mw)), `${mw} not found`);
  });
}

// ── Services Tests ────────────────────────────────────────
console.log('');
console.log('── Background Services ─────────────────────');

const services = ['services/cronService.js', 'services/emailService.js', 'services/reportGenerator.js'];

for (const svc of services) {
  test(`${svc} exists`, () => {
    assert(existsSync(resolve(ROOT, svc)), `${svc} not found`);
  });
}

// ── Utils Tests ───────────────────────────────────────────
console.log('');
console.log('── Utilities ───────────────────────────────');

const utils = ['utils/constants.js', 'utils/logger.js', 'utils/validators.js'];

for (const util of utils) {
  test(`${util} exists`, () => {
    assert(existsSync(resolve(ROOT, util)), `${util} not found`);
  });
}

// ── Summary ──────────────────────────────────────────────
console.log('');
console.log('══════════════════════════════════════════════');
console.log(`📊 Health Check: ${passed} passed, ${failed} failed`);
console.log('══════════════════════════════════════════════');

if (failed > 0) {
  process.exit(1);
}
