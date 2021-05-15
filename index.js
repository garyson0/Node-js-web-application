import express from 'express';
import morgan from 'morgan';
import render from './routes/render.js';
import targyakRouter from './routes/targyak.js';
import fajlokRouter from './routes/classfiles.js';
import ujTargyRouter from './routes/newclass.js';
import csatlakozasKilepesRouter from './routes/classjoinleave.js';

const app = express();
const port = 5000;

app.use(express.static('static'));
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.use('/', render);
app.use('/targyak', targyakRouter);
app.use('/classfiles', fajlokRouter);
app.use('/ujtargy', ujTargyRouter);
app.use('/classjoinleave', csatlakozasKilepesRouter);
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
