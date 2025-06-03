const assert = require('assert');
const jwtService = require('../services/jwt');

const secret = 'testsecret';
const payload = { userId: 123, role: 'tester' };

const token = jwtService.encode(payload, secret);
const decoded = jwtService.decode('Bearer ' + token, secret);

assert.deepStrictEqual(decoded, payload, 'Decoded payload should match the original');

console.log('JWT encode/decode test passed.');
