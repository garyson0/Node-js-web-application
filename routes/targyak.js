import express from 'express';
import * as db from '../db/lab4db.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, resp) => {
  const error = '';
  const targyId = { targykod: req.params.id };
  // const targyAdatai = await db.getTantargyInfosById(targyId);
  // const targyTagjai = await db.getMembersOfTantargy(targyId);
  const [targyAdatai, targyTagjai, targyFilek] = await Promise.all(
    [db.getTantargyInfosById(targyId), db.getMembersOfTantargy(targyId), db.getTargyFilek(targyId)],
  );
  resp.render('targyadatai', {
    error, targyAdatai, targyTagjai, targyFilek,
  });
});

export default router;
