## Portfolio Web App (Node.js + Express + EJS + SQLite)

A full-featured portfolio site with a public website (using your current design) and an admin dashboard to manage services, portfolio items, and contact/social settings.

### Tech
- Node.js + Express
- EJS templating
- SQLite (file-based DB)
- express-session for authentication
- bcrypt for password hashing
- body-parser for form parsing

### Project Structure
```
public/            # static assets (served at /)
  assets/css/
  assets/images/
views/             # EJS templates
  admin/
  partials/
  *.ejs
routes/
  public.js
  admin.js
models/
  db.js
  user.js
  service.js
  portfolio.js
  settings.js
server.js
package.json
README.md
```

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` (optional):
   ```bash
   echo "PORT=3000
SESSION_SECRET=change_this_secret
ADMIN_USER=admin
ADMIN_PASS=admin123" > .env
   ```
   The default admin user and password are seeded on first run.

3. Run the server:
   ```bash
   npm run dev
   # or
   npm start
   ```

4. Access:
   - Public: http://localhost:3000/
   - Admin Login: http://localhost:3000/admin/login
   - Admin Dashboard: http://localhost:3000/admin/dashboard

### Admin Features
- Login with seeded credentials (change via `.env` then remove user from DB if needed)
- Services CRUD: name, description
- Portfolio CRUD: title, description, image (use a URL like `/assets/images/work-1.png`)
- Settings: email, phone, and social links
- Logout

### Notes
- Static assets are served from `public/`. Your existing CSS and images are under `public/assets/`.
- Public pages render dynamic content from SQLite and mirror the previous design.
- Database file is `data.sqlite` in project root. You can back it up or delete to reset.

### Future Enhancements
- Image uploads for portfolio via Multer
- CSRF protection for admin forms
- Role-based users and password change UI

