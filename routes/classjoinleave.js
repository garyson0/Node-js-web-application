import express from 'express';
import * as db from '../db/lab4db.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, resp) => {
  const error = '';

  const [targyIdLista, felhasznaloLista] = await Promise.all(
    [db.getTantargyIdList(), db.getFelhasznaloIdList()],
  );
  resp.render('csatlakoz', { error, targyIdLista, felhasznaloLista });
});

router.post('/', async (req, resp) => {
  let error = '';
  const targyKod = req.body.targykod;
  const felhasznaloKod = req.body.felhasznalokod;

  const exists = {
    targykod: targyKod,
    felhasznalokod: felhasznaloKod,
  };

  const [targyIdLista, felhasznaloLista, userJoined] = await Promise.all(
    [db.getTantargyIdList(), db.getFelhasznaloIdList(), db.userExistsAtGivenTantargy(exists)],
  );

  const userJoinedTmp = userJoined.length;

  if (req.body.muvelet === 'kilep') {
    const jelentkezes = {
      targykod: targyKod,
      felhasznalokod: felhasznaloKod,
    };
    if (userJoinedTmp !== 1) {
      error = 'Hiba: az adott felhasznalo nem tartozik a targyhoz!';
    } else {
      error = 'Sikeres kilepes!';
      await db.deleteJelentkezes(jelentkezes);
    }
  } else {
    const jelentkezes = {
      targykod: targyKod,
      felhasznalokod: felhasznaloKod,
      beosztas: 0,
    };
    if (userJoinedTmp === 1) {
      error = 'Hiba: az adott felhasznalo mar csatlakozott a targyhoz!';
    } else {
      error = 'Sikeres csatlakozas!';
      await db.insertJelentkezes(jelentkezes);
    }
  }
  resp.render('csatlakoz', { error, targyIdLista, felhasznaloLista });
});

export default router;
