const db = require('./db');

function listContactLinks() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM contact_links ORDER BY id ASC', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function createContactLink({ label, url, icon }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO contact_links (label, url, icon) VALUES (?, ?, ?)',
      [label, url, icon || 'fa-solid fa-link'],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

function deleteContactLink(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM contact_links WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

module.exports = {
  listContactLinks,
  createContactLink,
  deleteContactLink
};

