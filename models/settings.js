const db = require('./db');

function getSettings() {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM settings WHERE id = 1', [], (err, row) => {
      if (err) return reject(err);
      resolve(
        row || {
          id: 1,
          email: 'shahisanjil@gmail.com',
          phone: '+977 9860654416 / +977 9841109290',
          facebook: 'https://www.facebook.com/sanjil.shahi.71',
          linkedin: 'https://www.linkedin.com/in/sanjil-shahi-08440b263/',
          github: 'https://github.com/Sanjiil',
          instagram: 'https://www.instagram.com/sanjilshahi/'
        }
      );
    });
  });
}

function upsertSettings(payload) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO settings (id, email, phone, facebook, linkedin, github, instagram)
      VALUES (1, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email=excluded.email,
        phone=excluded.phone,
        facebook=excluded.facebook,
        linkedin=excluded.linkedin,
        github=excluded.github,
        instagram=excluded.instagram
      `,
      [
        payload.email || null,
        payload.phone || null,
        payload.facebook || null,
        payload.linkedin || null,
        payload.github || null,
        payload.instagram || null
      ],
      function (err) {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
}

module.exports = { getSettings, upsertSettings };

