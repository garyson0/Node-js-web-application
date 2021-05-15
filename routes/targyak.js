import express from 'express';
import * as db from '../db/lab4db.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, resp) => {
  const error = '';
  const targyId = { targykod: req.params.id };
  const targyAdatai = await db.getTantargyInfosById(targyId);
  const targyTagjai = await db.getMembersOfTantargy(targyId);
  resp.render('targyadatai', { error, targyAdatai, targyTagjai });
});

export default router;
