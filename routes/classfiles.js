import express from 'express';
import eformidable from 'express-formidable';
import fs from 'fs';
import path from 'path';
import * as db from '../db/lab4db.js';

const router = express.Router();
const uploadDir = path.join(process.cwd(), 'uploadDir');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.use(eformidable({ uploadDir }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/:id', async (req, resp) => {
  let error = '';
  const fileHandler = req.files.targyfilek;
  const regiUtvonal = fileHandler.path;
  const newDir = `${uploadDir}/${req.params.id}/`;
  const ujUtvonal = `${uploadDir}/${req.params.id}/${req.files.targyfilek.name}`;
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir);
  }

  fs.copyFile(regiUtvonal, ujUtvonal, (err) => {
    const allomanyok = {
      targykod: req.params.id,
      allomanynev: fileHandler.name,
    };
    db.insertAllomanyok(allomanyok);

    if (err) {
      error = 'Sikertelen fajl feltoltes!';
    } else {
      error = 'Sikeres fajl feltoltes!';
    }
    return undefined;
  });
  const targyId = { targykod: req.params.id };
  const targyAdatai = await db.getTantargyInfosById(targyId);
  const targyTagjai = await db.getMembersOfTantargy(targyId);
  resp.render('targyadatai', { error, targyAdatai, targyTagjai });
});

export default router;
