import express from 'express';
import * as db from '../db/lab4db.js';
import { checkToken } from '../auth/middleware.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, resp) => {
  const error = '';
  const tulaj = {
    id: req.params.id,
  };
  const tantargyak = await db.findAllTantargyOfTulaj(tulaj);

  resp.render('sajat', { error, tantargyak });
});

router.post('/search/:id', async (req, resp) => {
  let tantargyak = [];
  const error = '';
  if (req.body.nametantargy) {
    tantargyak = await db.getTantargyByNameAndOwner(
      { nev: req.body.nametantargy, id: req.params.id },
    );
  } else {
    tantargyak = await db.findAllTantargyOfTulaj({ id: req.params.id });
  }
  resp.render('sajat', { error, tantargyak });
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
