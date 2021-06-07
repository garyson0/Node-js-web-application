import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as db from '../db/lab4db.js';
import secret from './secret.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/login', (req, resp) => {
  resp.render('login');
});

router.post('/login', async (req, resp) => {
  if (!req.body.username || !req.body.password) {
    resp.status(401).json('Hianyzo felhasznalonev vagy jelszo!');
  }
  const user = {
    username: req.body.username,
  };
  const userExists = await db.usernameExists(user);
  const userExistsTmp = userExists.length;

  if (userExistsTmp !== 1) {
    resp.status(401).json('Hiba: nem letezo felhasznalonev');
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
    resp.status(401).json('Hibas jelszo!');
  }
});

router.post('/regisztral', async (req, resp) => {
  if (!req.body.username || !req.body.password) {
    resp.status(401).json('Hianyzo felhasznalonev vagy jelszo!');
  }

  const registerUser = {
    felhnev: req.body.username,
    pass: bcrypt.hash(req.body.password, 10),
    role: 'user',
  };

  try {
    await db.insertFelhasznaloAuth(registerUser);
    resp.redirect('/');
  } catch (err) {
    console.log(err.message);
  }
});

router.post('/logout', (req, resp) => {
  resp.clearCookie('token');
  resp.redirect('/');
});
export default router;
