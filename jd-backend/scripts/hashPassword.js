/**
 * Run: node scripts/hashPassword.js
 * Enter your chosen admin password when prompted.
 * Copy the output hash into your .env as ADMIN_PASSWORD_HASH
 */

const bcrypt   = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter your admin password: ', async (password) => {
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  console.log('\n✅ Copy this into your .env:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  rl.close();
});
