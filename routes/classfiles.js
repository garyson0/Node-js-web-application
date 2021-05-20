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
  const error = '';
  const fileHandler = req.files.targyfilek;

  const allomanyok = {
    targykod: req.params.id,
    allomanynev: fileHandler.name,
    letoltinnen: fileHandler.path,
  };

  await db.insertAllomanyok(allomanyok);

  const targyId = { targykod: req.params.id };

  const [targyAdatai, targyTagjai, targyFilek] = await Promise.all(
    [db.getTantargyInfosById(targyId), db.getMembersOfTantargy(targyId), db.getTargyFilek(targyId)],
  );

  // const targyAdatai = await db.getTantargyInfosById(targyId);
  // const targyTagjai = await db.getMembersOfTantargy(targyId);
  resp.render('targyadatai', {
    error, targyAdatai, targyTagjai, targyFilek,
  });
});

export default router;
