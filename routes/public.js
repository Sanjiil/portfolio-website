const express = require('express');
const router = express.Router();

const { listServices } = require('../models/service');
const { listPortfolio } = require('../models/portfolio');
const { getSettings } = require('../models/settings');
const { listContactLinks } = require('../models/contactLinks');

router.get('/', async (req, res) => {
  const [services, portfolio, settings, contactLinks] = await Promise.all([
    listServices(),
    listPortfolio(),
    getSettings(),
    listContactLinks()
  ]);
  res.render('index', {
    title: "Sanjil's Portfolio Website",
    services,
    portfolio,
    settings,
    contactLinks
  });
});

router.get('/about', async (req, res) => {
  const [settings, contactLinks] = await Promise.all([
    getSettings(),
    listContactLinks()
  ]);
  res.render('about', { title: 'About', settings, contactLinks });
});

router.get('/services', async (req, res) => {
  const [services, settings, contactLinks] = await Promise.all([
    listServices(),
    getSettings(),
    listContactLinks()
  ]);
  res.render('services', {
    title: "Sanjil's Portfolio Website",
    services,
    settings,
    contactLinks
  });
});

router.get('/portfolio', async (req, res) => {
  const [portfolio, settings, contactLinks] = await Promise.all([
    listPortfolio(),
    getSettings(),
    listContactLinks()
  ]);
  res.render('portfolio', {
    title: "Sanjil's Portfolio Website",
    portfolio,
    settings,
    contactLinks
  });
});

router.get('/contact', async (req, res) => {
  const [settings, contactLinks] = await Promise.all([
    getSettings(),
    listContactLinks()
  ]);
  res.render('contact', {
    title: "Sanjil's Portfolio Website",
    settings,
    contactLinks
  });
});

module.exports = router;

