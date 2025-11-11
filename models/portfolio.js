const db = require('./db');

function listPortfolio() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM portfolio_items ORDER BY id DESC', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function createPortfolio({ title, description, image }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO portfolio_items (title, description, image) VALUES (?, ?, ?)',
      [title, description, image],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

function getPortfolio(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM portfolio_items WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function updatePortfolio(id, { title, description, image }) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE portfolio_items SET title = ?, description = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, image, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });
}

function deletePortfolio(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM portfolio_items WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

module.exports = {
  listPortfolio,
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio
};

