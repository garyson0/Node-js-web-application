// Moduláris express router létrehozása

import express from 'express';
import * as db from '../db/lab4db.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, resp) => {
  const tantargyak = await db.findAllTantargy();
  const error = '';
  resp.render('index', { error, tantargyak });
});

export default router;
