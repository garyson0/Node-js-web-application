import express from 'express';
import bcrypt from 'bcrypt';
import * as db from '../db/lab4db.js';
import { checkAdmin } from '../auth/middleware.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', checkAdmin, (req, resp) => {
  resp.render('ujuser');
});

router.post('/', checkAdmin, async (req, resp) => {
  if (!req.body.usernamenew || !req.body.passwordnew) {
    resp.status(401).json('Hianyzo felhasznalonev vagy jelszo!');
  }

  const registerUser = {
    felhnev: req.body.usernamenew,
    pass: bcrypt.hash(req.body.passwordnew, 10),
  };

  try {
    await db.insertFelhasznaloAuth(registerUser);
    resp.redirect('/');
  } catch (err) {
    console.log(err.message);
  }
});

export default router;
