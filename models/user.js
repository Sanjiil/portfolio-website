const bcrypt = require('bcrypt');
const db = require('./db');

function findByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function listUsers() {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, username, createdAt FROM users ORDER BY id ASC',
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
      [username, passwordHash],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

async function ensureAdminSeeded() {
  const defaultUser = process.env.ADMIN_USER || 'admin';
  const defaultPass = process.env.ADMIN_PASS || 'admin123';
  const existing = await findByUsername(defaultUser);
  if (!existing) {
    const passwordHash = await bcrypt.hash(defaultPass, 10);
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
        [defaultUser, passwordHash],
        (err) => (err ? reject(err) : resolve())
      );
    });
    // eslint-disable-next-line no-console
    console.log('Seeded default admin user:', defaultUser);
  }
}

module.exports = { findByUsername, ensureAdminSeeded, listUsers, createUser };

