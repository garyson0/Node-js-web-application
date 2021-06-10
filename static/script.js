/* eslint-disable max-lines-per-function */
function removeElement(id) {
  const elem = document.getElementById(id);
  elem.remove();
}

// eslint-disable-next-line no-unused-vars
async function showFilesOfClass(id) {
  try {
    await fetch('/getfile/'.concat(id)).then((response) => response.text()).then(((responseText) => {
      const data = JSON.parse(responseText);
      const checkIfDivExists = document.getElementById(id.concat('_allomanyok'));
      if (checkIfDivExists) {
        removeElement(id.concat('_allomanyok'));
      }
      const divClicked = document.getElementById(id);
      const newDiv = document.createElement('div');
      const title = document.createElement('h3');
      title.innerHTML = 'Tárgy állományai';
      newDiv.appendChild(title);

      Object.values(data).forEach((val) => {
        newDiv.className = 'roundedCornerAllomanyok';
        newDiv.id = id.concat('_allomanyok');
        const a = document.createElement('a');
        const linkText = document.createTextNode(val.allomanyNev);
        let link = val.letoltInnen; // abszolut eleresi utvonalbol kiveszem az "upload_xyz"-t
        const n = link.lastIndexOf('\\');
        link = link.substring(n + 1);
        a.appendChild(linkText);
        a.title = val.allomanyNev;
        a.href = '/uploadDir/'.concat(link);
        a.setAttribute('download', 'download');
        newDiv.appendChild(a);
        const br = document.createElement('br');
        newDiv.appendChild(br);
      });
      divClicked.parentNode.insertBefore(newDiv, divClicked.nextSibling); // insert after
    }));
  } catch (err) {
    console.log(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
async function deleteTargy(allomanyNev, userId) {
  const divToDelete = document.getElementById(allomanyNev);
  const allomanyokCim = document.getElementById('allomanyokcim');
  const targyKod = divToDelete.className;
  try {
    const data = {
      targykod: targyKod,
      allomanynev: allomanyNev,
      userID: userId,
    };
    await fetch('/targyak', {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then((response) => response.text()).then(((responseText) => {
      const response = JSON.parse(responseText);
      const p = document.createElement('p');
      const text = document.createTextNode(response);
      p.appendChild(text);
      allomanyokCim.parentNode.insertBefore(p, allomanyokCim.nextSibling); // insert after
      if (response === 'Sikeres torles!') {
        removeElement(allomanyNev);
      }
    }));
  } catch (err) {
    console.log(err.message);
  }
}

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line max-lines-per-function
async function showTargyModifyWindow() {
  try {
    await fetch('/dashboard/gettargyak').then((response) => response.text()).then(((responseText) => {
      const data = JSON.parse(responseText);
      console.log(data);
      const checkIfDivExists = document.getElementById('left-operation');
      if (checkIfDivExists) {
        removeElement('left-operation');
      }
      const divClicked = document.getElementById('operation');
      const br = document.createElement('br');
      const newDiv = document.createElement('div');
      const title = document.createElement('h2');
      title.innerHTML = 'Tárgy leírás módosítása';
      // newDiv.appendChild(br);
      newDiv.appendChild(title);

      const form = document.createElement('form');
      form.setAttribute('method', 'post');
      form.setAttribute('action', '/dashboard/updateTargy');
      form.setAttribute('id', 'form-centered');

      const targyLabel = document.createElement('label');
      targyLabel.innerHTML = 'Módosítandó tantárgy:';

      const selectTargy = document.createElement('select');
      selectTargy.setAttribute('name', 'targy');
      const evfolyamLabel = document.createElement('label');
      evfolyamLabel.innerHTML = 'Évfolyam:';
      const kurzosokLabel = document.createElement('label');
      kurzosokLabel.innerHTML = 'Kurzusok száma:';
      const szeminarLabel = document.createElement('label');
      szeminarLabel.innerHTML = 'Szemináriumok száma:';
      const laborLabel = document.createElement('label');
      laborLabel.innerHTML = 'Laborok száma:';
      const tulajdonosLabel = document.createElement('label');
      tulajdonosLabel.innerHTML = 'Vezető tanár ID-ja:';

      const evfolyamInput = document.createElement('input');
      evfolyamInput.setAttribute('type', 'number');
      evfolyamInput.setAttribute('name', 'evfolyam');
      evfolyamInput.setAttribute('min', 1);
      evfolyamInput.setAttribute('max', 3);

      const kurzusokInput = document.createElement('input');
      kurzusokInput.setAttribute('type', 'number');
      kurzusokInput.setAttribute('name', 'kurzusoksz');
      kurzusokInput.setAttribute('min', 7);
      kurzusokInput.setAttribute('max', 14);

      const szeminarInput = document.createElement('input');
      szeminarInput.setAttribute('type', 'number');
      szeminarInput.setAttribute('name', 'szeminarsz');
      szeminarInput.setAttribute('min', 7);
      szeminarInput.setAttribute('max', 14);

      const laborokInput = document.createElement('input');
      laborokInput.setAttribute('type', 'number');
      laborokInput.setAttribute('name', 'laboroksz');
      laborokInput.setAttribute('min', 7);
      laborokInput.setAttribute('max', 14);

      const tulajdonosInput = document.createElement('input');
      tulajdonosInput.setAttribute('type', 'number');
      tulajdonosInput.setAttribute('name', 'tulajdonos');

      const submit = document.createElement('input');
      submit.setAttribute('type', 'submit');
      submit.setAttribute('value', 'Módosít');

      // selectet feltoltom a targyak neveivel
      Object.values(data).forEach((val) => {
        const option = document.createElement('option');
        option.value = val.targyKod;
        option.text = val.targyNeve;
        selectTargy.appendChild(option);
      });
      newDiv.id = 'left-operation';

      // label + input/select
      form.appendChild(targyLabel);
      form.appendChild(selectTargy);
      form.appendChild(br.cloneNode());

      form.appendChild(evfolyamLabel);
      form.appendChild(evfolyamInput);
      form.appendChild(br.cloneNode());

      form.appendChild(kurzosokLabel);
      form.appendChild(kurzusokInput);
      form.appendChild(br.cloneNode());

      form.appendChild(szeminarLabel);
      form.appendChild(szeminarInput);
      form.appendChild(br.cloneNode());

      form.appendChild(laborLabel);
      form.appendChild(laborokInput);
      form.appendChild(br.cloneNode());
    
      form.appendChild(tulajdonosLabel);
      form.appendChild(tulajdonosInput);
      form.appendChild(br.cloneNode());

      form.appendChild(submit);

      newDiv.appendChild(form);

      divClicked.parentNode.insertBefore(newDiv, divClicked.nextSibling); // insert after
    }));
  } catch (err) {
    console.log(err.message);
  }
}

async function showOrarend() {
  try {
    // kiurit orarend
    const cellak = document.getElementsByTagName('td');
    for (let i = 0; i < cellak.length; i++) {
      cellak[i].innerHTML = '';
    }
    const tanarNevObj = document.getElementById('tanarnev');
    const tanarNev = tanarNevObj.value;
    const data = {
      tanarnev: tanarNev,
    };
    await fetch('/dashboard/getorarend/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then((response) => response.text()).then(((responseText) => {
      const data = JSON.parse(responseText);
      console.log(data);

      Object.values(data).forEach((val) => {
        const id = val.nap.concat('-').concat(val.mettol).concat('-').concat(val.meddig);
        console.log(id);
        const cella = document.getElementById(id);
        cella.innerHTML = val.targyNeve;
      });
    }));
  } catch (err) {
    console.log(err.message);
  }
}

async function getOrarend(tanarNev) {
  try {
    // kiurit orarend
    const cellak = document.getElementsByTagName('td');
    for (let i = 0; i < cellak.length; i++) {
      cellak[i].innerHTML = '';
    }
    const data = {
      tanarnev: tanarNev,
    };
    await fetch('/orarend', {
      body: JSON.stringify(data),
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then((response) => response.text()).then(((responseText) => {
      const dataResp = JSON.parse(responseText);

      Object.values(dataResp).forEach((val) => {
        const id = val.nap.concat('-').concat(val.mettol).concat('-').concat(val.meddig);
        const cella = document.getElementById(id);
        cella.innerHTML = val.targyNeve;
      });
    }));
  } catch (err) {
    console.log(err.message);
  }
}
