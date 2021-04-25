/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable complexity */
/* eslint-disable radix */
import express from 'express';
import morgan from 'morgan';
import formidable from 'formidable';
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

app.get('/hello', (req, resp) => {
  resp.send('Hello world!');
});

function existsValueAtGivePos(value, array, pos) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][pos] === value) {
      return true;
    }
  }

  return false;
}

function studentAlreadyJoined(studentid, array, classid) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][0] === classid && array[i][1] === studentid) {
      return true;
    }
  }

  return false;
}

const targyak = [];
const targyakDiakjai = [];
// I. form: uj tantargy
app.post('/classinfos', (req, resp) => {
  // validalas
  const tmpTargy = [];
  const namePattern = /^[A-Z][a-z0-9]+$/;
  let targykod = JSON.stringify(req.body.targykod);
  targykod = targykod.replace(/"([^"]+(?="))"/g, '$1');
  targykod = parseInt(targykod);

  let targyneve = JSON.stringify(req.body.targyneve);
  targyneve = targyneve.replace(/"([^"]+(?="))"/g, '$1');

  let targyevfolyam = JSON.stringify(req.body.targyevfolyam);
  targyevfolyam = targyevfolyam.replace(/"([^"]+(?="))"/g, '$1');
  targyevfolyam = parseInt(targyevfolyam);

  let kurzusokszama = JSON.stringify(req.body.kurzusokszama);
  kurzusokszama = kurzusokszama.replace(/"([^"]+(?="))"/g, '$1');
  kurzusokszama = parseInt(kurzusokszama);

  let szeminariumokszama = JSON.stringify(req.body.szeminariumokszama);
  szeminariumokszama = szeminariumokszama.replace(/"([^"]+(?="))"/g, '$1');
  szeminariumokszama = parseInt(szeminariumokszama);

  let laborokszama = JSON.stringify(req.body.laborokszama);
  laborokszama = laborokszama.replace(/"([^"]+(?="))"/g, '$1');
  laborokszama = parseInt(laborokszama);

  if (targykod <= 0 || existsValueAtGivePos(targykod, targyak, 0)) {
    resp.status(400).send('Hibas targykod, vagy mar letezik!');
  } else if (!targyneve.match(namePattern)) {
    resp.status(400).send('Hibas targynev!');
  } else if (targyevfolyam < 1 || targyevfolyam > 3) {
    resp.status(400).send('Hibas evfolyam!');
  } else if (kurzusokszama < 7) {
    resp.status(400).send('Kurzusok szama nem megfelelo!');
  } else if (szeminariumokszama < 7) {
    resp.status(400).send('Szeminariumok szama nem megfelelo!');
  } else if (laborokszama < 7) {
    resp.status(400).send('Laborok szama nem megfelelo!');
  } else {
    tmpTargy.push(targykod);
    tmpTargy.push(targyneve);
    tmpTargy.push(targyevfolyam);
    tmpTargy.push(kurzusokszama);
    tmpTargy.push(szeminariumokszama);
    tmpTargy.push(laborokszama);

    targyak.push(tmpTargy);
    resp.status(200).send('Tárgy sikeresen hozzáadva!');
    // console.log(targyak);
  }
});

// II. formban megadott tantargyID almappaba helyezi a filekat, ha letezik a tantargy
app.post('/classfiles', (req, resp) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let targykod = JSON.stringify(fields.targykod1);
    targykod = targykod.replace(/"([^"]+(?="))"/g, '$1');

    if (!existsValueAtGivePos(targykod, targyak, 0)) {
      return resp.status(400).send('Sikertelen feltöltés, nem létező tantárgy!');
    }
    const regiUtvonal = files.targyfilek.path;
    const newDir = `${uploadDir}/${targykod}/`;
    const ujUtvonal = `${uploadDir}/${targykod}/${files.targyfilek.name}`;
    const nyersAdat = fs.readFileSync(regiUtvonal);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
    }
    fs.writeFile(ujUtvonal, nyersAdat, (err) => {
      if (err) console.log(err);
      return resp.status(200).send('Sikeres feltöltés!');
    });
  });
});

// III. form : diák csatlakozása adott tárgyhoz
app.post('/classjoin', (req, resp) => {
  let targykod = JSON.stringify(req.body.targykodcsatlakoz);
  targykod = targykod.replace(/"([^"]+(?="))"/g, '$1');
  targykod = parseInt(targykod);

  let diakkod = JSON.stringify(req.body.diakkod);
  diakkod = diakkod.replace(/"([^"]+(?="))"/g, '$1');
  diakkod = parseInt(diakkod);

  if (targykod <= 0 || !existsValueAtGivePos(targykod, targyak, 0)) {
    resp.status(400).send('Nem megfelelő adatok: pozitív, illetve létező tantárgy kódja kell legyen!');
  }
  if (diakkod <= 0 || studentAlreadyJoined(diakkod, targyakDiakjai, targykod)) {
    resp.status(400).send('Nem megfelelő adatok: pozitív, illetve olyan tárgyhoz csatlakozhat, ahova még nem csatlakozott!');
  } else {
    resp.status(200).send('Diák sikeresen hozzáadva a tárgyhoz!');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
