// Moduláris express router létrehozása

import express from 'express';
import * as db from '../db/lab4db.js';
import { checkToken } from '../auth/middleware.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, resp) => {
  const error = '';
  const tantargyak = await db.findAllTantargy();

  resp.render('index', { error, tantargyak });
});

router.post('/search', async (req, resp) => {
  let tantargyak = [];
  const error = '';
  if (req.body.nametantargy) {
    tantargyak = await db.getTantargyByName({ nev: req.body.nametantargy });
  } else {
    tantargyak = await db.findAllTantargy();
  }
  resp.render('index', { error, tantargyak });
});

router.get('/getfile/:id', async (req, resp) => {
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
