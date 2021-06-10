import express from 'express';
import * as db from '../db/lab4db.js';
import { checkToken, checkAdmin } from '../auth/middleware.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', checkAdmin, (req, resp) => {
  const error = '';
  resp.render('ujtargy', { error });
});

router.post('/', checkAdmin, async (req, resp) => {
  let error = '';
  const namePattern = /^[A-Z][a-z0-9]+$/;
  const targyNeve = (req.body.targyneve).toString();
  let targyEvfolyam = (req.body.targyevfolyam).toString();
  targyEvfolyam = parseInt(targyEvfolyam, 10);

  let kurzusokSzama = (req.body.kurzusokszama).toString();
  kurzusokSzama = parseInt(kurzusokSzama, 10);

  let szeminariumokSzama = (req.body.szeminariumokszama).toString();
  szeminariumokSzama = parseInt(szeminariumokSzama, 10);

  let laborokSzama = (req.body.laborokszama).toString();
  laborokSzama = parseInt(laborokSzama, 10);

  const exists = {
    targyneve: targyNeve,
    targyevfolyam: targyEvfolyam,
    kurzusokszama: kurzusokSzama,
    szeminariumokszama: szeminariumokSzama,
    laborokszama: laborokSzama,
  };
  const checkTargy = await db.tantargyExists(exists);
  const checkTargyTmp = checkTargy.length;

  const checkEvfolyam = targyEvfolyam >= 1 && targyEvfolyam <= 3;

  if (checkTargyTmp === 1 || !targyNeve.match(namePattern)) {
    error = 'Hibas targynev, vagy mar letezik!';
  } else if (!checkEvfolyam) {
    error = 'Hibas evfolyam!';
  } else {
    const ujtargy = {
      nev: targyNeve,
      evfolyam: targyEvfolyam,
      kurzus: kurzusokSzama,
      szem: szeminariumokSzama,
      lab: laborokSzama,
      tulajdonosid: req.body.tulajdonosid,
    };
    error = 'Sikeres letrehozas!';
    await db.insertTantargy(ujtargy);
  }
  const tantargyak = await db.findAllTantargy();
  resp.render('index', { error, tantargyak });
});

export default router;
