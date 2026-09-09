import test from 'node:test';
import assert from 'node:assert/strict';

// Set before dynamic imports: no real database or identity provider is contacted.
process.env.NODE_ENV='test';
process.env.DATABASE_URL='postgresql://test:test@127.0.0.1:1/isolated_test';
process.env.CLERK_SECRET_KEY='sk_test_placeholder';
const { TrustController } = await import('../api/controllers/trust.controller.js');
const response = () => ({ code:200, status(code){this.code=code;return this;}, json(body){this.body=body;return this;} });
test('cannot revoke another user session', async () => {
  const revoked=[];
  const res=response();
  await TrustController.revokeSecuritySession({user:{clerkId:'user_a'},body:{id:'session_b'},authAdapter:{listSessions:async()=>[{id:'session_a',status:'active'}],revokeSession:async id=>revoked.push(id)}},res,error=>{throw error;});
  assert.equal(res.code,404);
  assert.deepEqual(revoked,[]);
});
test('revoke other sessions preserves authenticated session', async () => {
  const revoked=[];
  const res=response();
  await TrustController.revokeSecuritySession({user:{clerkId:'user_a'},auth:{sessionId:'current'},body:{allOther:true},authAdapter:{listSessions:async uid=>{assert.equal(uid,'user_a');return [{id:'current',status:'active'},{id:'other',status:'active'}];},revokeSession:async id=>revoked.push(id)}},res,error=>{throw error;});
  assert.deepEqual(revoked,['other']);
  assert.equal(res.body.count,1);
});
