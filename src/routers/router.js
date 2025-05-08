import path from 'path';
import express from 'express';
import configurationRouter from './configuration.routes.js';

const router = express.Router();

function renderView(view) {
  return (req, res) => res.sendFile(path.resolve(import.meta.dirname, `../views/${view}`));
}

router.get('/', renderView('main.html'));
router.get('/create-configuration', renderView('create-configuration.html'));

router.use('/internal/configuration', configurationRouter);

export default router;
