import mysql from 'mysql';
import util from 'util';

const pool = mysql.createPool({
  connectionLimit: 50,
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
      tulajdonosID int,
      PRIMARY KEY(targyKod)
  );`);
}

export function insertTantargy(targyak) {
  return queryPromise(`INSERT INTO Tantargy (targyNeve, evfolyam, kurzusokSzama, szeminariumokSzama, laborokSzama, tulajdonosID) VALUES (
    ?, ?, ?, ?, ?, ?)`, [targyak.nev, targyak.evfolyam, targyak.kurzus, targyak.szem, targyak.lab, targyak.tulajdonosid]);
}

export function getTantargyOwner(targy) {
  return queryPromise('SELECT tulajdonosID FROM Tantargy WHERE targyKod = ?', [targy.targykod]);
}
export function findAllTantargy() {
  return queryPromise('SELECT * FROM Tantargy');
}

export function findAllTantargyNev() {
  return queryPromise('SELECT targyNeve FROM Tantargy');
}

export function findAllTantargyIdName() {
  return queryPromise('SELECT targyKod,targyNeve FROM Tantargy');
}

export function findAllTantargyOfTulaj(tulaj) {
  return queryPromise('SELECT * FROM Tantargy WHERE tulajdonosID = ?', [tulaj.id]);
}

export function getTantargyByName(targy) {
  return queryPromise('SELECT * FROM Tantargy WHERE targyNeve LIKE ?', [targy.nev]);
}

export function getTantargyByNameAndOwner(attr) {
  return queryPromise('SELECT * FROM Tantargy WHERE targyNeve LIKE ? AND tulajdonosID = ?', [attr.nev, attr.id]);
}

export function updateTargy(attr) {
  if (attr.evfolyam) {
    queryPromise(`UPDATE Tantargy
    SET evfolyam = ? 
    WHERE targyKod = ?`,  [attr.evfolyam, attr.targyKod]);
  }

  if (attr.kurzusokSzama) {
    queryPromise(`UPDATE Tantargy
    SET kurzusokSzama = ? 
    WHERE targyKod = ?`,  [attr.kurzusokSzama, attr.targyKod]);
  }

  if (attr.szeminariumokSzama) {
    queryPromise(`UPDATE Tantargy
    SET szeminariumokSzama = ? 
    WHERE targyKod = ?`,  [attr.szeminariumokSzama, attr.targyKod]);
  }
  if (attr.laborokSzama) {
    queryPromise(`UPDATE Tantargy
    SET laborokSzama = ? 
    WHERE targyKod = ?`,  [attr.laborokSzama, attr.targyKod]);
  }
  if (attr.vezetotanar) {
    queryPromise(`UPDATE Tantargy
    SET tulajdonosID = ? 
    WHERE targyKod = ?`,  [attr.vezetotanar, attr.targyKod]);
  }
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

export function deleteAllomany(allomany) {
  return queryPromise('DELETE FROM Allomanyok WHERE targyKod = ? AND allomanyNev = ?', [allomany.targykod, allomany.allomanynev]);
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

/*
export function createFelhasznaloAuthTable() {
  return queryPromise(`CREATE TABLE IF NOT EXISTS FelhasznaloAuth(
    authId int AUTO_INCREMENT,
    felhasznalonev varchar(250) UNIQUE,
    passwordSalted varchar(400),
    frole varchar(50),
    PRIMARY KEY(authId)
);`);
}
*/

export function createFelhasznaloAuthTable() {
  return queryPromise(`CREATE TABLE IF NOT EXISTS FelhasznaloAuth(
    authId int AUTO_INCREMENT,
    felhasznalonev varchar(250) UNIQUE,
    passwordSalted varchar(400),
    PRIMARY KEY(authId)
);`);
}

export function usernameExists(exists) {
  return queryPromise('SELECT 1 FROM FelhasznaloAuth WHERE felhasznalonev = ?', [exists.username]);
}

export function getUserIdByUserName(user) {
  return queryPromise('SELECT authId FROM FelhasznaloAuth WHERE felhasznalonev = ?', [user.username]);
}

export function getUsersName() {
  return queryPromise('SELECT felhasznalonev FROM FelhasznaloAuth WHERE felhasznalonev <> ?', 'admin');
}

export function getPasswordAndSalt(user) {
  return queryPromise('SELECT passwordSalted FROM FelhasznaloAuth WHERE felhasznalonev = ?', [user.username]);
}

/*
export function insertFelhasznaloAuth(felhasznalo) {
  return queryPromise(`INSERT INTO FelhasznaloAuth (felhasznalonev, passwordSalted, frole)
  VALUES(?, ?, ?)`, [felhasznalo.felhnev, felhasznalo.pass, felhasznalo.role]);
}
*/

export function insertFelhasznaloAuth(felhasznalo) {
  return queryPromise(`INSERT INTO FelhasznaloAuth (felhasznalonev, passwordSalted) VALUES (
    ?, ?)`, [felhasznalo.felhnev, felhasznalo.pass]);
}

export function updatePassword(felhasznalo) {
  return queryPromise(`UPDATE FelhasznaloAuth
  SET passwordSalted = ?
  WHERE felhasznalonev = ?`, [felhasznalo.pass, felhasznalo.felhnev]);
}
export function createOrarendTable() {
  return queryPromise(`CREATE TABLE IF NOT EXISTS Orarend(
    orarendID int AUTO_INCREMENT,
    nap varchar(50),
    mettol int,
    meddig int,
    tanarUsername varchar(250),
    targyNeve varchar(250),
    PRIMARY KEY(orarendID)
);`);
}

export function insertOrarend(orarend) {
  return queryPromise('INSERT INTO Orarend(nap,mettol,meddig,tanarUsername,targyNeve) VALUES (?,?,?,?,?)', [orarend.nap, orarend.mettol, orarend.meddig, orarend.tanar, orarend.targy]);
}

export function checkOrarendFreeSpace(tanar) {
  return queryPromise('SELECT orarendID FROM Orarend WHERE tanarUsername = ? AND nap = ? AND mettol = ? AND meddig = ?', [tanar.tanarnev, tanar.nap, tanar.mettol, tanar.meddig]);
}

export function getOrarend(tanar) {
  return queryPromise('SELECT nap, mettol , meddig, targyNeve FROM Orarend WHERE tanarUsername = ?', [tanar.username]);
}

export function deleteOrarend(tanar) {
  return queryPromise('DELETE FROM Orarend WHERE tanarUsername = ? AND nap = ? AND mettol = ? AND meddig = ? AND targyNeve = ?', [tanar.tanar, tanar.nap, tanar.mettol, tanar.meddig, tanar.targy]);
}

createTantargyTable();
createFelhasznaloTable();
createJelentkezesTable();
createAllomanyokTable();
createFelhasznaloAuthTable();
createOrarendTable();
