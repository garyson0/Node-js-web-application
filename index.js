import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import render from './routes/render.js';
import targyakRouter from './routes/targyak.js';
import fajlokRouter from './routes/classfiles.js';
import ujTargyRouter from './routes/newclass.js';
import csatlakozasKilepesRouter from './routes/classjoinleave.js';
import authRouter from './auth/router.js';
import { decodeToken, checkToken } from './auth/middleware.js';

const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(decodeToken);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use(morgan('tiny'));
app.use('/', render);
app.use('/auth', authRouter);
app.use('/targyak', targyakRouter);
app.use('/classfiles', fajlokRouter);
app.use('/classjoinleave', csatlakozasKilepesRouter);
app.use('/ujtargy', ujTargyRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
