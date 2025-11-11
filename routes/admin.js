const express = require('express');
const bcrypt = require('bcrypt');
const { findByUsername, listUsers, createUser } = require('../models/user');
const { listServices, createService, getService, updateService, deleteService } = require('../models/service');
const { listPortfolio, createPortfolio, getPortfolio, updatePortfolio, deletePortfolio } = require('../models/portfolio');
const { getSettings, upsertSettings } = require('../models/settings');
const {
  listContactLinks,
  createContactLink,
  deleteContactLink
} = require('../models/contactLinks');

const router = express.Router();

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/admin/login');
}

router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/admin/dashboard');
  res.render('admin/login', { title: 'Admin Login', error: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findByUsername(username);
  if (!user) return res.render('admin/login', { title: 'Admin Login', error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.render('admin/login', { title: 'Admin Login', error: 'Invalid credentials' });
  req.session.user = { id: user.id, username: user.username };
  res.redirect('/admin/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

router.get('/dashboard', requireAuth, async (req, res) => {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    user: req.session.user
  });
});

// Services CRUD
router.get('/services', requireAuth, async (req, res) => {
  const services = await listServices();
  const flash = req.session.adminFlash || {};
  delete req.session.adminFlash;
  res.render('admin/services', {
    title: 'Services Management',
    user: req.session.user,
    services,
    flash
  });
});

router.post('/services', requireAuth, async (req, res) => {
  const name = (req.body.name || '').trim();
  const description = (req.body.description || '').trim();

  if (!name || name.length < 2) {
    req.session.adminFlash = { serviceError: 'Service name must be at least 2 characters.' };
    return res.redirect('/admin/services');
  }
  if (!description || description.length < 10) {
    req.session.adminFlash = { serviceError: 'Description must be at least 10 characters.' };
    return res.redirect('/admin/services');
  }

  try {
    await createService({ name, description });
    req.session.adminFlash = { serviceSuccess: `Service "${name}" created successfully.` };
  } catch (err) {
    console.error('Failed to create service', err);
    req.session.adminFlash = { serviceError: 'Unable to create service. Please try again.' };
  }

  res.redirect('/admin/services');
});

router.post('/services/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const name = (req.body.name || '').trim();
  const description = (req.body.description || '').trim();

  if (!name || name.length < 2) {
    req.session.adminFlash = { serviceError: 'Service name must be at least 2 characters.' };
    return res.redirect('/admin/services');
  }
  if (!description || description.length < 10) {
    req.session.adminFlash = { serviceError: 'Description must be at least 10 characters.' };
    return res.redirect('/admin/services');
  }

  try {
    await updateService(id, { name, description });
    req.session.adminFlash = { serviceSuccess: `Service "${name}" updated successfully.` };
  } catch (err) {
    console.error('Failed to update service', err);
    req.session.adminFlash = { serviceError: 'Unable to update service. Please try again.' };
  }

  res.redirect('/admin/services');
});

router.post('/services/:id/delete', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteService(id);
    req.session.adminFlash = { serviceSuccess: 'Service deleted successfully.' };
  } catch (err) {
    console.error('Failed to delete service', err);
    req.session.adminFlash = { serviceError: 'Unable to delete service. Please try again.' };
  }
  res.redirect('/admin/services');
});

// Portfolio CRUD
router.get('/portfolio', requireAuth, async (req, res) => {
  const portfolio = await listPortfolio();
  const flash = req.session.adminFlash || {};
  delete req.session.adminFlash;
  res.render('admin/portfolio', {
    title: 'Portfolio Management',
    user: req.session.user,
    portfolio,
    flash
  });
});

router.post('/portfolio', requireAuth, async (req, res) => {
  const title = (req.body.title || '').trim();
  const description = (req.body.description || '').trim();
  const image = (req.body.image || '').trim();

  const errors = [];
  if (!title || title.length < 3) {
    errors.push('Title must be at least 3 characters.');
  }
  if (!description || description.length < 10) {
    errors.push('Description must be at least 10 characters.');
  }
  if (!image || (!image.startsWith('/') && !image.startsWith('http://') && !image.startsWith('https://'))) {
    errors.push('Image URL must be a valid path (starting with /) or full URL (starting with http:// or https://).');
  }

  if (errors.length > 0) {
    req.session.adminFlash = { portfolioError: errors.join(' ') };
    return res.redirect('/admin/portfolio');
  }

  try {
    await createPortfolio({ title, description, image });
    req.session.adminFlash = { portfolioSuccess: `Portfolio item "${title}" created successfully.` };
  } catch (err) {
    console.error('Failed to create portfolio item', err);
    req.session.adminFlash = { portfolioError: 'Unable to create portfolio item. Please try again.' };
  }

  res.redirect('/admin/portfolio');
});

router.post('/portfolio/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const title = (req.body.title || '').trim();
  const description = (req.body.description || '').trim();
  const image = (req.body.image || '').trim();

  const errors = [];
  if (!title || title.length < 3) {
    errors.push('Title must be at least 3 characters.');
  }
  if (!description || description.length < 10) {
    errors.push('Description must be at least 10 characters.');
  }
  if (!image || (!image.startsWith('/') && !image.startsWith('http://') && !image.startsWith('https://'))) {
    errors.push('Image URL must be a valid path (starting with /) or full URL (starting with http:// or https://).');
  }

  if (errors.length > 0) {
    req.session.adminFlash = { portfolioError: errors.join(' ') };
    return res.redirect('/admin/portfolio');
  }

  try {
    await updatePortfolio(id, { title, description, image });
    req.session.adminFlash = { portfolioSuccess: `Portfolio item "${title}" updated successfully.` };
  } catch (err) {
    console.error('Failed to update portfolio item', err);
    req.session.adminFlash = { portfolioError: 'Unable to update portfolio item. Please try again.' };
  }

  res.redirect('/admin/portfolio');
});

router.post('/portfolio/:id/delete', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await deletePortfolio(id);
    req.session.adminFlash = { portfolioSuccess: 'Portfolio item deleted successfully.' };
  } catch (err) {
    console.error('Failed to delete portfolio item', err);
    req.session.adminFlash = { portfolioError: 'Unable to delete portfolio item. Please try again.' };
  }
  res.redirect('/admin/portfolio');
});

// Settings (contact info)
router.get('/settings', requireAuth, async (req, res) => {
  const [currentSettings, contactLinks] = await Promise.all([
    getSettings(),
    listContactLinks()
  ]);
  const flash = req.session.adminFlash || {};
  delete req.session.adminFlash;
  const settingsFormValues = flash.settingsFormData
    ? { ...currentSettings, ...flash.settingsFormData }
    : currentSettings;
  const linkFormValues = flash.linkFormData || { label: '', url: '', icon: '' };
  res.render('admin/settings', {
    title: 'Contact & Social Settings',
    user: req.session.user,
    currentSettings,
    settings: settingsFormValues,
    flash,
    contactLinks,
    linkForm: linkFormValues
  });
});

router.post('/settings', requireAuth, async (req, res) => {
  const raw = {
    email: req.body.email || '',
    phone: req.body.phone || '',
    facebook: req.body.facebook || '',
    linkedin: req.body.linkedin || '',
    github: req.body.github || '',
    instagram: req.body.instagram || ''
  };

  const trimmed = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, value.trim()])
  );

  const errors = [];
  const email = trimmed.email;
  const phone = trimmed.phone;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email is required.');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!phone) {
    errors.push('Phone number is required.');
  }

  const urlFields = ['facebook', 'linkedin', 'github', 'instagram'];
  urlFields.forEach((field) => {
    const value = trimmed[field];
    if (value) {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      } catch (err) {
        errors.push(`The ${field} URL must be a valid URL (include http/https).`);
      }
    }
  });

  if (errors.length > 0) {
    req.session.adminFlash = {
      settingsError: errors.join(' '),
      settingsFormData: trimmed
    };
    return res.redirect('/admin/settings');
  }

  const sanitized = Object.fromEntries(
    Object.entries(trimmed).map(([key, value]) => [key, value || null])
  );

  await upsertSettings(sanitized);
  req.session.adminFlash = {
    settingsSuccess: 'Contact and social settings updated successfully.'
  };
  return res.redirect('/admin/settings');
});

router.post('/settings/links', requireAuth, async (req, res) => {
  const label = (req.body.label || '').trim();
  const url = (req.body.url || '').trim();
  const icon = (req.body.icon || '').trim() || 'fa-solid fa-link';

  const errors = [];
  if (!label || label.length < 2) {
    errors.push('Label must be at least 2 characters.');
  }
  if (!url) {
    errors.push('URL is required.');
  } else {
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch (err) {
      errors.push('Please provide a valid URL (include http/https).');
    }
  }

  if (errors.length > 0) {
    req.session.adminFlash = {
      settingsError: errors.join(' '),
      linkFormData: { label, url, icon }
    };
    return res.redirect('/admin/settings#custom-links');
  }

  try {
    await createContactLink({ label, url, icon });
    req.session.adminFlash = {
      settingsSuccess: `Added custom contact link "${label}".`
    };
  } catch (err) {
    console.error('Failed to create contact link', err);
    req.session.adminFlash = {
      settingsError: 'Unable to add contact link. Please try again later.',
      linkFormData: { label, url, icon }
    };
  }

  return res.redirect('/admin/settings#custom-links');
});

router.post('/settings/links/:id/delete', requireAuth, async (req, res) => {
  try {
    await deleteContactLink(req.params.id);
    req.session.adminFlash = {
      settingsSuccess: 'Removed custom contact link.'
    };
  } catch (err) {
    console.error('Failed to delete contact link', err);
    req.session.adminFlash = {
      settingsError: 'Unable to delete contact link. Please try again later.'
    };
  }
  return res.redirect('/admin/settings#custom-links');
});

// User management
router.get('/users', requireAuth, async (req, res) => {
  const users = await listUsers();
  const flash = req.session.adminFlash || {};
  delete req.session.adminFlash;
  res.render('admin/users', {
    title: 'Admin Users',
    user: req.session.user,
    users,
    flash
  });
});

router.post('/users', requireAuth, async (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';

  if (!username || !password || password.length < 6) {
    req.session.adminFlash = {
      userError: 'Username and password are required. Password must be at least 6 characters.'
    };
    return res.redirect('/admin/users');
  }

  try {
    await createUser(username, password);
    req.session.adminFlash = { userSuccess: `Admin user "${username}" created.` };
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT') {
      req.session.adminFlash = { userError: 'That username already exists. Choose another.' };
    } else {
      console.error('Failed to create admin user', err);
      req.session.adminFlash = { userError: 'Unable to create user. Please try again.' };
    }
  }

  return res.redirect('/admin/users');
});

module.exports = router;

