import jwt from 'jsonwebtoken';
import secret from './secret.js';

export function decodeToken(req, resp, next) {
  if (req.cookies.token) {
    try {
      const tokenObject = jwt.verify(req.cookies.token, secret);
      // szeminarimuon mukodott ugyanilyen formaban, ezert disableltem, de probalom javitani
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
    resp.status(401);
    resp.render('login');
  }
}
