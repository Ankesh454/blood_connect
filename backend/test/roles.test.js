const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'roles-test-secret';
const { protect, requireRole, preventAdminAction } = require('../src/middlewares/authMiddleware');
const { normalizeRole } = require('../scripts/migrate-user-roles');
const User = require('../src/models/User');

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('legacy donor and recipient roles normalize to User', () => {
  assert.equal(normalizeRole('donor'), 'user');
  assert.equal(normalizeRole('recipient'), 'user');
  assert.equal(normalizeRole('hospital'), 'hospital');
  assert.equal(normalizeRole('admin'), 'admin');
});

test('database role enum has User, Hospital and Admin only', () => {
  assert.deepEqual(User.schema.path('role').enumValues, ['user', 'hospital', 'admin']);
  assert.deepEqual(User.schema.path('approvalStatus').enumValues, ['none', 'pending', 'approved', 'rejected']);
});

test('authentication rejects missing and expired tokens', async () => {
  for (const authorization of [undefined, `Bearer ${jwt.sign({ id: '000000000000000000000001' }, process.env.JWT_SECRET, { expiresIn: -1 })}`]) {
    const res = response();
    await protect({ headers: { authorization } }, res, () => assert.fail('must reject token'));
    assert.equal(res.statusCode, 401);
  }
});

test('User can enter User routes while pending Hospital applications cannot enter Hospital routes', () => {
  let passed = false;
  const userRes = response();
  requireRole('user')({ user: { role: 'user', approvalStatus: 'pending' } }, userRes, () => { passed = true; });
  assert.equal(passed, true);

  const pendingApplicationRes = response();
  requireRole('hospital')({ user: { role: 'user', requestedRole: 'hospital', approvalStatus: 'pending' } }, pendingApplicationRes, () => assert.fail('pending application must not have hospital role'));
  assert.equal(pendingApplicationRes.statusCode, 403);

  const hospitalRes = response();
  requireRole('hospital')({ user: { role: 'hospital', approvalStatus: 'pending' } }, hospitalRes, () => assert.fail('pending hospital must be denied'));
  assert.equal(hospitalRes.statusCode, 403);

  const approvedRes = response();
  requireRole('hospital')({ user: { role: 'hospital', approvalStatus: 'approved' } }, approvedRes, () => { passed = true; });
  assert.equal(passed, true);
});

test('admin-only actions reject normal users and public blood actions reject admins', () => {
  const adminRes = response();
  requireRole('admin')({ user: { role: 'user' } }, adminRes, () => assert.fail('normal user must be denied'));
  assert.equal(adminRes.statusCode, 403);

  const userRes = response();
  preventAdminAction({ user: { role: 'admin' } }, userRes, () => assert.fail('admin action must be denied'));
  assert.equal(userRes.statusCode, 403);
});
