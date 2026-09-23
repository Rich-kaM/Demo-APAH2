import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const input = [];
for await (const chunk of process.stdin) input.push(chunk);
const password = Buffer.concat(input).toString('utf8').replace(/\r?\n$/, '');
if (password.length < 16 || password.length > 1024) {
  process.stderr.write('Provide an administrator password between 16 and 1024 characters through stdin.\n');
  process.exit(1);
}
const salt = randomBytes(16).toString('hex');
const hash = await scrypt(password, salt, 64);
process.stdout.write(`${salt}:${hash.toString('hex')}\n`);
