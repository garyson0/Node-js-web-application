import express from 'express';
import * as db from '../db/lab4db.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:id', async (req, resp) => {
  const error = '';
  const targyId = { targykod: req.params.id };
  const [targyAdataiTmp, targyTagjai, targyFilek] = await Promise.all(
    [db.getTantargyInfosById(targyId), db.getMembersOfTantargy(targyId), db.getTargyFilek(targyId)],
  );

  const targyAdatai = targyAdataiTmp[0];
  resp.render('targyadatai', {
    error, targyAdatai, targyTagjai, targyFilek,
  });
});

router.delete('/', async (req, resp) => {
  try {
    await db.deleteAllomany(req.body);
    resp.json('Sikeres torles!');
  } catch (err) {
    resp.status(500).json('Sikertelen torles!');
    console.error(err);
  }
});

export default router;
