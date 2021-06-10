import jwt from 'jsonwebtoken';
import secret from './secret.js';

export function decodeToken(req, resp, next) {
  if (req.cookies.token) {
    try {
      const tokenObject = jwt.verify(req.cookies.token, secret);
      // eslint-disable-next-line no-param-reassign
      resp.locals.tokenObject = tokenObject;
    } catch (err) {
      resp.clearCookie('token');
      resp.status(401).end();
    }
  }
  next();
}

export function checkToken(req, resp, next) {
  if (resp.locals.tokenObject) {
    next();
  } else {
    const error = 'A kért tartalomhoz először jelentkezz be !';
    resp.status(401).render('login', { error });
  }
}

export function checkAdmin(req, resp, next) {
  if (resp.locals.tokenObject) {
    if (resp.locals.tokenObject.username === 'admin') next();
    else {
      const error = 'Nincs jogosultságod ide belépni!';
      resp.status(401).render('error', { error });
    }
  } else {
    const error = 'Nincs jogosultságod ide belépni!';
    resp.status(401).render('error', { error });
  }
}
