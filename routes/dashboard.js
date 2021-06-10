/* eslint-disable max-lines-per-function */
import express from 'express';
import bcrypt from 'bcrypt';
import * as db from '../db/lab4db.js';
import {  checkAdmin } from '../auth/middleware.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', checkAdmin,  async (req, resp) => {
  const error = '';
  resp.render('dashboard', { error });
});

router.post('/updateTargy', checkAdmin, async (req, resp) => {
  let error = '';
  const updateDict = {};
  const targykod = req.body.targy;
  updateDict.targyKod = targykod;
  if (req.body.evfolyam) {
    updateDict.evfolyam = req.body.evfolyam;
  }

  if (req.body.kurzusoksz) {
    updateDict.kurzusokSzama = req.body.kurzusoksz;
  }
  if (req.body.szeminarsz) {
    updateDict.szeminariumokSzama = req.body.szeminarsz;
  }
  if (req.body.laboroksz) {
    updateDict.laborokSzama = req.body.laboroksz;
  }

  if (req.body.tulajdonos) {
    updateDict.vezetotanar = req.body.tulajdonos;
  }

  try {
    await db.updateTargy(updateDict);
    error = 'Sikeres módosítás!';
    resp.render('dashboard', { error });
  } catch (err) {
    error = 'Sikertelen módosítás!';
    console.log(`Error: ${err}`);
    resp.render('dashboard', { error });
  }
});

router.get('/gettargyak', checkAdmin,  async (req, resp) => {
  try {
    const targyak = await db.findAllTantargyIdName();
    resp.json(targyak);
  } catch (err) {
    console.log(`Error: ${err}`);
    resp.status(500).json('Nem sikerult lekerni a targyakat!');
  }
});

router.get('/orarend', checkAdmin, async (req, resp) => {
  const error = '';
  const orarend = await db.getOrarend({ username: 'admin' });
  try {
    const [tanarNevLista, tantargyLista] = await Promise.all(
      [db.getUsersName(), db.findAllTantargyNev()],
    );
    resp.render('orarend', {
      error, tanarNevLista, tantargyLista, orarend,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    resp.status(500).json('Sikertelen betoltes');
  }
});

router.post('/orarend', checkAdmin, async (req, resp) => {
  let error = '';

  const insertOra = {
    nap: req.body.nap,
    mettol: req.body.mettol,
    meddig: req.body.meddig,
    tanar: req.body.tanarnev,
    targy: req.body.tantargynev,
  };

  const checkIfEmpty = {
    tanarnev: req.body.tanarnev,
    nap: req.body.nap,
    mettol: req.body.mettol,
    meddig: req.body.meddig,
  };

  if (req.body.muvelet === 'hozzaad') {
    try {
      const [tanarNevLista, tantargyLista] = await Promise.all(
        [db.getUsersName(), db.findAllTantargyNev()],
      );

      const checkIfTeacherFree = await db.checkOrarendFreeSpace(checkIfEmpty);
      if (checkIfTeacherFree.length > 0) {
        error = 'A tanár foglalt az adott időpontban';
        const orarend = await db.getOrarend({ username: req.body.tanarnev });

        resp.render('orarend', {
          error, tanarNevLista, tantargyLista, orarend,
        });
      } else {
        await db.insertOrarend(insertOra);
        error = 'Sikeres hozzáadás';
        const orarend = await db.getOrarend({ username: req.body.tanarnev });
        resp.render('orarend', {
          error, tanarNevLista, tantargyLista, orarend,
        });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      const [tanarNevLista, tantargyLista] = await Promise.all(
        [db.getUsersName(), db.findAllTantargyNev()],
      );
      error = 'Sikertelen hozzáadás';
      const orarend = await db.getOrarend({ username: req.body.tanarnev });

      resp.render('orarend', {
        error, tanarNevLista, tantargyLista, orarend,
      });
    }
  } else {
    try {
      const [tanarNevLista, tantargyLista] = await Promise.all(
        [db.getUsersName(), db.findAllTantargyNev()],
      );

      const checkIfTeacherFree = await db.checkOrarendFreeSpace(checkIfEmpty);
      if (checkIfTeacherFree.length > 0) {
        error = 'Sikeres törlés';

        await db.deleteOrarend(insertOra);

        const orarend = await db.getOrarend({ username: req.body.tanarnev });

        resp.render('orarend', {
          error, tanarNevLista, tantargyLista, orarend,
        });
      } else {
        error = 'Nem létezik az órarendjében a tanárnak ebben az időpontban óra';
        const orarend = await db.getOrarend({ username: req.body.tanarnev });
        resp.render('orarend', {
          error, tanarNevLista, tantargyLista, orarend,
        });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      const [tanarNevLista, tantargyLista] = await Promise.all(
        [db.getUsersName(), db.findAllTantargyNev()],
      );
      error = 'Sikertelen törlés';
      const orarend = await db.getOrarend({ username: req.body.tanarnev });

      resp.render('orarend', {
        error, tanarNevLista, tantargyLista, orarend,
      });
    }
  }
});

router.post('/getorarend', checkAdmin, async (req, resp) => {
  try {
    console.log('asd');
    const orarend = await db.getOrarend({ username: req.body.tanarnev });
    resp.json(orarend);
  } catch (err) {
    console.log(`Error: ${err}`);
    resp.status(500).json('Nem sikerult lekerni a tanarhoz tartozo orarendet!');
  }
});

router.get('/jelszocsere', checkAdmin,  async (req, resp) => {
  const error = '';
  const tanarNevLista = await db.getUsersName();
  resp.render('jelszocsere', { error, tanarNevLista });
});

router.post('/jelszocsere', checkAdmin, async (req, resp) => {
  let error = '';
  if (req.body.password !== req.body.password2) {
    error = 'A jelszók nem egyeznek meg!';
  }

  try {
    const updateDict = {
      felhnev: req.body.felhasznalonev,
      pass: bcrypt.hash(req.body.password, 10),
    };
    await db.updatePassword(updateDict);
    error = 'Sikeres módosítás!';
    const tanarNevLista = await db.getUsersName();
    resp.render('jelszocsere', { error, tanarNevLista });
  } catch (err) {
    error = 'Sikertelen módosítás!';
    console.log(`Error: ${err}`);
    const tanarNevLista = await db.getUsersName();
    resp.render('jelszocsere', { error, tanarNevLista });
  }
});

export default router;
