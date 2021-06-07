import express from 'express';
import eformidable from 'express-formidable';
import fs from 'fs';
import path from 'path';
import * as db from '../db/lab4db.js';
import { checkToken } from '../auth/middleware.js';

const router = express.Router();
const uploadDir = path.join(process.cwd(), 'uploadDir');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.use(eformidable({ uploadDir }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/:id', checkToken, async (req, resp) => {
  const error = '';
  const fileHandler = req.files.targyfilek;

  const allomanyok = {
    targykod: req.params.id,
    allomanynev: fileHandler.name,
    letoltinnen: fileHandler.path,
  };

  await db.insertAllomanyok(allomanyok);

  const targyId = { targykod: req.params.id };

  const [targyAdataiTmp, targyTagjai, targyFilek, targyTulajaTmp] = await Promise.all(
    [db.getTantargyInfosById(targyId), db.getMembersOfTantargy(targyId),
      db.getTargyFilek(targyId), db.getTantargyOwner(targyId)],
  );

  const targyAdatai = targyAdataiTmp[0];
  const targyTulaja = targyTulajaTmp[0];

  resp.render('targyadatai', {
    error, targyAdatai, targyTagjai, targyFilek, targyTulaja,
  });
});

export default router;
