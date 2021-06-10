import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as db from '../db/lab4db.js';
import secret from './secret.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/login', (req, resp) => {
  const error = '';
  resp.render('login', { error });
});

router.post('/login', async (req, resp) => {
  let error = '';
  if (!req.body.username || !req.body.password) {
    error = 'Hianyzo felhasznalonev vagy jelszo!';
    resp.status(401).render('login', { error });
  }
  const user = {
    username: req.body.username,
  };
  const userExists = await db.usernameExists(user);
  const userExistsTmp = userExists.length;

  if (userExistsTmp !== 1) {
    error = 'Hiba: nem letezo felhasznalonev';
    resp.status(401).render('login', { error });
  }

  const userID = await db.getUserIdByUserName(user);
  const pass = await db.getPasswordAndSalt(user);
  const passCmp = pass[0].passwordSalted;
  const userid = userID[0].authId;

  if (await bcrypt.compare(req.body.password, passCmp)) {
    const token = jwt.sign({ username: req.body.username, id: userid }, secret);
    resp.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    resp.redirect('/');
  } else {
    error = 'Hibas jelszo!';
    resp.status(401).render('login', { error });
  }
});

router.post('/logout', (req, resp) => {
  resp.clearCookie('token');
  resp.redirect('/');
});
export default router;
