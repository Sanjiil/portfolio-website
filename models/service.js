const db = require('./db');

function listServices() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM services ORDER BY id DESC', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function createService({ name, description }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO services (name, description) VALUES (?, ?)',
      [name, description],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

function getService(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM services WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function updateService(id, { name, description }) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE services SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });
}

function deleteService(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM services WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

module.exports = {
  listServices,
  createService,
  getService,
  updateService,
  deleteService
};

