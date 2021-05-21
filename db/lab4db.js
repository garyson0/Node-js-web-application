import mysql from 'mysql';
import util from 'util';

const pool = mysql.createPool({
  connectionLimit: 10,
  database: 'webprog',
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'fnaticmsiGergo159753',
});

const queryPromise = util.promisify(pool.query).bind(pool);

export function createTantargyTable() {
  return queryPromise(`CREATE TABLE IF NOT EXISTS Tantargy(
      targyKod int AUTO_INCREMENT,
      targyNeve varchar(20),
      evfolyam int,
      kurzusokSzama int,
      szeminariumokSzama int,
      laborokSzama int,
      PRIMARY KEY(targyKod)
  );`);
}

export function insertTantargy(targyak) {
  return queryPromise(`INSERT INTO Tantargy (targyNeve, evfolyam, kurzusokSzama, szeminariumokSzama, laborokSzama) VALUES (
    ?, ?, ?, ?, ?)`, [targyak.nev, targyak.evfolyam, targyak.kurzus, targyak.szem, targyak.lab]);
}

export function findAllTantargy() {
  return queryPromise('SELECT * FROM Tantargy');
}

export function createFelhasznaloTable() {
  return queryPromise(`CREATE TABLE IF NOT EXISTS Felhasznalo(
    felhasznaloKod int AUTO_INCREMENT,
    nev varchar(30),
    PRIMARY KEY(felhasznaloKod)
  );`);
}

export function insertFelhasznalo(felhasznalo) {
  return queryPromise(`INSERT INTO Felhasznalo (nev) VALUES (
    ?)`, [felhasznalo.nev]);
}

export function createJelentkezesTable() {
  return queryPromise(`CREATE TABLE IF NOT EXISTS Jelentkezes(
      targyKod int,
      felhasznaloKod int,
      beosztas int,
      PRIMARY KEY(targyKod,felhasznaloKod)
  );`);
}

export function insertJelentkezes(jelentkezes) {
  return queryPromise(`INSERT INTO Jelentkezes (targyKod, felhasznaloKod, beosztas) VALUES (
    ?, ?, ?)`, [jelentkezes.targykod, jelentkezes.felhasznalokod, jelentkezes.beosztas]);
}

export function deleteJelentkezes(del) {
  return queryPromise('DELETE FROM Jelentkezes WHERE targyKod = ? AND felhasznaloKod = ?', [del.targykod, del.felhasznalokod]);
}

export function createAllomanyokTable() {
  return queryPromise(`CREATE TABLE IF NOT EXISTS Allomanyok(
      allomanyId int AUTO_INCREMENT,
      targyKod int,
      allomanyNev varchar(60),
      letoltInnen varchar(250),
      PRIMARY KEY(allomanyId)
  );`);
}

export function insertAllomanyok(allomanyok) {
  return queryPromise(`INSERT INTO Allomanyok (targyKod, allomanyNev, letoltInnen) VALUES (
    ?, ?, ?)`, [allomanyok.targykod, allomanyok.allomanynev, allomanyok.letoltinnen]);
}

export function getTantargyInfosById(tantargy) {
  const ret = [];
  ret.push(queryPromise('SELECT * FROM Tantargy WHERE targyKod = ?', [tantargy.targykod]));
  return ret[0];
}

export function getMembersOfTantargy(tantargy) {
  return queryPromise(`SELECT f.felhasznaloKod, f.nev, j.beosztas FROM Felhasznalo AS f JOIN Jelentkezes AS j ON f.felhasznaloKod = j.felhasznaloKod WHERE j.targyKod = ?
    `, [tantargy.targykod]);
}

export function getTantargyIdList() {
  return queryPromise('SELECT targyKod FROM Tantargy');
}

export function getFelhasznaloIdList() {
  return queryPromise('SELECT felhasznaloKod FROM Felhasznalo');
}

export function getTargyFilek(tantargy) {
  return queryPromise('SELECT allomanyNev, letoltInnen FROM Allomanyok WHERE targyKod = ?', [tantargy.targykod]);
}

export function userExistsAtGivenTantargy(exists) {
  return queryPromise('SELECT 1 FROM Jelentkezes WHERE targyKod = ? AND felhasznaloKod = ?', [exists.targykod, exists.felhasznalokod]);
}

export function tantargyExists(exists) {
  return queryPromise('SELECT 1 FROM Tantargy WHERE targyNeve = ? AND evfolyam = ? AND kurzusokSzama = ? AND szeminariumokSzama = ? AND laborokSzama = ?', [exists.targyneve, exists.targyevfolyam, exists.kurzusokszama, exists.szeminariumokszama, exists.laborokszama]);
}

createTantargyTable();
createFelhasznaloTable();
createJelentkezesTable();
createAllomanyokTable();
// teszteleshez
let felhasznalo = {
  nev: 'Elemer',
};
insertFelhasznalo(felhasznalo);

felhasznalo = {
  nev: 'Geza',
};
insertFelhasznalo(felhasznalo);
