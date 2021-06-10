import express from 'express';
import * as db from '../db/lab4db.js';
import { checkToken, checkAdmin } from '../auth/middleware.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', checkToken, async (req, resp) => {
  resp.render('clientorarend');
});
router.post('/', checkToken, async (req, resp) => {
  try {
    const orarend = await db.getOrarend({ username: req.body.tanarnev });
    resp.json(orarend);
  } catch (err) {
    console.log(`Error: ${err}`);
    resp.status(500).json('Sikertelen betoltes');
  }
});

export default router;
