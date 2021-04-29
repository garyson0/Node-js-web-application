import express from 'express';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import fs from 'fs';
import path from 'path';

const app = express();
const uploadDir = path.join(process.cwd(), 'uploadDir');
const port = 5000;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(morgan('tiny'));

app.use(express.static('static'));

app.use(express.urlencoded({ extended: true }));

const targyak = [];
const targyakDiakjai = {};
// I. form: uj tantargy
app.post('/classinfos', (req, resp) => {
  const tmpTargy = [];
  const namePattern = /^[A-Z][a-z0-9]+$/;
  let targykod = (req.body.targykod).toString();
  targykod = parseInt(targykod, 10);

  const targyneve = (req.body.targyneve).toString();

  let targyevfolyam = (req.body.targyevfolyam).toString();
  targyevfolyam = parseInt(targyevfolyam, 10);

  let kurzusokszama = (req.body.kurzusokszama).toString();
  kurzusokszama = parseInt(kurzusokszama, 10);

  let szeminariumokszama = (req.body.szeminariumokszama).toString();
  szeminariumokszama = parseInt(szeminariumokszama, 10);

  let laborokszama = (req.body.laborokszama).toString();
  laborokszama = parseInt(laborokszama, 10);

  const checkTargy = targykod <= 0 || (targyak.find((elem) => elem[0] === targykod)) !== undefined;
  const checkEvfolyam = targyevfolyam < 1 || targyevfolyam > 3;

  if (!checkTargy || !targyneve.match(namePattern)) {
    resp.status(400).send('Hibas targykod/nev, vagy mar letezik!');
  } else if (!checkEvfolyam) {
    resp.status(400).send('Hibas evfolyam!');
  } else {
    tmpTargy.push(targykod);
    tmpTargy.push(targyneve);
    tmpTargy.push(targyevfolyam);
    tmpTargy.push(kurzusokszama);
    tmpTargy.push(szeminariumokszama);
    tmpTargy.push(laborokszama);
    targyak.push(tmpTargy);
    targyakDiakjai[targykod] = [];

    resp.status(200).send('Tárgy sikeresen hozzáadva!');
  }
});

// III. form : diák csatlakozása adott tárgyhoz
app.post('/classjoin', (req, resp) => {
  console.log('beleptem');
  let targykod = (req.body.targykodcsatlakoz).toString();
  targykod = parseInt(targykod, 10);

  let diakkod = (req.body.diakkod).toString();
  diakkod = parseInt(diakkod, 10);

  const checkTargyLetezik = targyak.find((elem) => elem[0] === targykod);
  if (targykod <= 0 || checkTargyLetezik === undefined) {
    resp.status(400).send('Nem megfelelő adatok: pozitív, illetve létező tantárgy kódja kell legyen!');
  }

  const checkDiak = targyakDiakjai[targykod].find((elem) => elem === diakkod);
  if (diakkod <= 0 || checkDiak !== undefined) {
    resp.status(400).send('Nem megfelelő adatok: pozitív, illetve olyan tárgyhoz csatlakozhat, ahova még nem csatlakozott!');
  } else {
    targyakDiakjai[targykod].push(diakkod);
    resp.status(200).send('Diák sikeresen hozzáadva a tárgyhoz!');
  }
});

// IV.form: diák kilépése adott tárgyból
app.post('/classleave', (req, resp) => {
  let targykod = (req.body.targykodkilep).toString();
  targykod = parseInt(targykod, 10);

  let diakkod = (req.body.diakkodkilep).toString();
  diakkod = parseInt(diakkod, 10);

  const checkTargyLetezik = targyak.find((elem) => elem[0] === targykod);
  if (targykod <= 0 || checkTargyLetezik === undefined) {
    resp.status(400).send('Nem megfelelő adatok: pozitív, illetve létező tantárgy kódja kell legyen!');
  }
  const checkDiak = targyakDiakjai[targykod].find((elem) => elem === diakkod);
  if (diakkod <= 0 || checkDiak === undefined) {
    resp.status(400).send('Nem megfelelő adatok: pozitív, illetve olyan tárgyból léphet ki, amelyhez tartozik!');
  } else {
    resp.status(200).send('Diák sikeresen kilépve a tárgyból!');
  }
});

app.use(eformidable({ uploadDir }));
// II. formban megadott tantargyID almappaba helyezi a filekat, ha letezik a tantargy
app.post('/classfiles', (req, resp) => {
  let targykod = (req.fields.targykod1).toString();
  targykod = parseInt(targykod, 10);

  const checkTargyLetezik = targyak.find((elem) => elem[0] === targykod);
  if (checkTargyLetezik === undefined) {
    return resp.status(400).send('Sikertelen feltöltés, nem létező tantárgy!');
  }
  const regiUtvonal = req.files.targyfilek.path;
  const newDir = `${uploadDir}/${targykod}/`;
  const ujUtvonal = `${uploadDir}/${targykod}/${req.files.targyfilek.name}`;
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir);
  }

  fs.copyFile(regiUtvonal, ujUtvonal, (err) => {
    if (err) return resp.status(400).send('Sikertelen fájl másolás!');
    resp.status(200).send('Sikeres feltöltés!');
    return undefined;
  });

  return undefined;
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
