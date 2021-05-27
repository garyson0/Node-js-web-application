function removeElement(id) {
  const elem = document.getElementById(id);
  elem.remove();
}

async function showFilesOfClass(id) {
  try {
    await fetch('/'.concat(id)).then((response) => response.text()).then(((responseText) => {
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
    alert(err.message);
  }
}

async function deleteTargy(allomanyNev) {
  if (confirm('Biztosan szeretne torolni ezt az allomanyt?')) {
    const divToDelete = document.getElementById(allomanyNev);
    const allomanyokCim = document.getElementById('allomanyokcim');
    const targyKod = divToDelete.className;
    try {
      const data = {
        targykod: targyKod,
        allomanynev: allomanyNev,
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
      alert(err.message);
    }
  }
}
