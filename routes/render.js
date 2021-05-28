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

router.get('/:id', async (req, resp) => {
  try {
    const tantargy = {
      targykod: req.params.id,
    };
    const fajlok = await db.getTargyFilek(tantargy);

    resp.json(fajlok);
  } catch (err) {
    console.log(`Error: ${err}`);
    resp.status(500).json('Nem sikerult lekerni a targyhoz tartozo fajlokat!');
  }
});

export default router;
