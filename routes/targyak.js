import express from 'express';
import * as db from '../db/lab4db.js';
import { checkToken } from '../auth/middleware.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:id', checkToken, async (req, resp) => {
  const error = '';
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

router.delete('/', checkToken, async (req, resp) => {
  try {
    // le ellenorizem a jogosultsagot
    const targyTulajaTmp = await db.getTantargyOwner({ targykod: req.body.targykod });
    const targyTulajaID = targyTulajaTmp[0];
    if (targyTulajaID.tulajdonosID.toString() === req.body.userID) {
      const responseDelete = await db.deleteAllomany(req.body);
      if (responseDelete.affectedRows === 0) resp.json('Nem sikerult az adatbazisbol torolni az allomanyt!');
      resp.json('Sikeres torles!');
    } else {
      resp.json(401).json('Nincs jogosultságod törölni!');
    }
  } catch (err) {
    resp.status(500).json('Sikertelen torles!');
    console.error(err);
  }
});

export default router;
