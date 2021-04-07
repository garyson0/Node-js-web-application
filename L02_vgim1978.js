// beepitett checkValidity fuggveny burkolo fuggvenye
function validDate() {
    let dateElement = document.getElementById("szuldatum");
    if(document.getElementById("error-message-date"))
    {
        document.getElementById("error-message-date").remove();
    }
    if(dateElement.checkValidity() === false)
    {
        let buttonElement = document.getElementById("butt-on");
        let errorMessageElement = document.createElement("p");
        errorMessageElement.id = "error-message-date";
        errorMessageElement.innerText = "Hibas datum!";
        errorMessageElement.style.color = "red";
        dateElement.parentNode.insertBefore(errorMessageElement,dateElement.nextSibling); // insert after

        return false;

    }
    return true;
}

// beepitett checkValidity fuggveny burkolo fuggvenye
function validFirstName() {
    let firtNameElement = document.getElementById("csaladnev");
    if(document.getElementById("error-message-first-name"))
    {
        document.getElementById("error-message-first-name").remove();
    }
    if(firtNameElement.checkValidity() === false)
    {
        let errorMessageElement = document.createElement("p");
        errorMessageElement.id = "error-message-first-name";
        errorMessageElement.innerText = "Hibas csaladnev!";
        errorMessageElement.style.color = "red";
        firtNameElement.parentNode.insertBefore(errorMessageElement,firtNameElement.nextSibling); // insert after

        return false;

    }
    return true;
}

// beepitett checkValidity fuggveny burkolo fuggvenye
function validLastName() {
    let lastNameElement = document.getElementById("keresztnev");
    if(document.getElementById("error-message-last-name"))
    {
        document.getElementById("error-message-last-name").remove();
    }
    if(lastNameElement.checkValidity() === false)
    {
        let errorMessageElement = document.createElement("p");
        errorMessageElement.id = "error-message-last-name";
        errorMessageElement.innerText = "Hibas keresztnev!";
        errorMessageElement.style.color = "red";
        lastNameElement.parentNode.insertBefore(errorMessageElement,lastNameElement.nextSibling); // insert after

        return false;

    }
    return true;
}

// email cim ellenorzes
function validEmailAddress(email) {
    const emailPattern = /^[A-Za-z0-9_.]+(@yahoo|@gmail)\.(com)$/;
    let elem = document.getElementById(email);
    if(document.getElementById("hibas-email"))
    {
        document.getElementById("hibas-email").remove();
    }   
    if (!elem.value.match(emailPattern))
    {
        let hibaEmail = document.createElement("p");
        hibaEmail.id = "hibas-email"
        hibaEmail.innerText = "Hibas e-mail cim!";
        hibaEmail.style.color = "red";
        elem.parentNode.insertBefore(hibaEmail,elem.nextSibling); //insert after
        
        return false;
    }
    return true;
}

// url ellenorzes
function validWebPage(url) {
    // minta: http(s)://(subdomain).(domain).(com/hu/etc)
    const webPagePattern = /^(http|https):\/\/([a-zA-Z0-9-_]+)\.([a-zA-Z0-9-_]+)\.([a-z]+)$/;
    let elem = document.getElementById(url);
    if(document.getElementById("hibas-weboldal"))
    {
        document.getElementById("hibas-weboldal").remove();
    }   
    if (!elem.value.match(webPagePattern))
    {
        let hibaWeboldal = document.createElement("p");
        hibaWeboldal.id = "hibas-weboldal"
        hibaWeboldal.innerText = "Hibas weboldal!";
        hibaWeboldal.style.color = "red";
        elem.parentNode.insertBefore(hibaWeboldal,elem.nextSibling); //insert after

        return false;
        
    }
    return true;
}

function checkBeforeSubmit() {
    let buttonElement = document.getElementById("butt-on");
    let dateElement = document.getElementById("szuldatum");
    let firstName = document.getElementById("csaladnev");
    let lastName = document.getElementById("keresztnev");
    if  (validEmailAddress('emailcim') === true && validWebPage('url') === true 
        && dateElement.checkValidity() === true && firstName.checkValidity() === true 
        && lastName.checkValidity() === true)
    {
        buttonElement.disabled = false;
    }
    else
    {
        buttonElement.disabled = true;
    }

}

function addLastModifiedDate() {
    let time = document.lastModified;
    document.getElementById("footer-shooter")innerText = time;
    document.getElementById("footer-shooter").style.textAlign = 'center';
}

function startGame() {
    document.getElementById('jatekos-info').style.display = 'block';

    // jatekos neve label beallitas
    let firstName = document.getElementById("form-a1").elements[0].value;
    let lastName = document.getElementById("form-a1").elements[1].value;
    let fullName = "Név: ";
    fullName = fullName.concat(firstName);
    fullName = fullName.concat(' ');
    fullName = fullName.concat(lastName);
    document.getElementById("jatekos-nev").innerHTML = fullName;
    // becenev
    let beceNev = document.getElementById("form-a1").elements[5].value;
    let tmp = "Becenév: ";
    tmp = tmp.concat(beceNev);
    document.getElementById("bece-nev").innerHTML = tmp;

    // penz
    let penzOsszeg = document.getElementById("form-a1").elements[6].value;
    let tmp_penz = "Pénz összeg:";
    tmp_penz = tmp_penz.concat(penzOsszeg);
    
    // beallit adatok, eredmenytabla
    document.getElementById("jatekos-penz").innerHTML = parseInt(penzOsszeg);
    document.getElementById("gep-penz").innerHTML = generateNumber(150);
    document.getElementById("penz-osszeg").innerHTML = tmp_penz;

}



// onclick image event, valasztunk ko/papir/ollo kozul 
function selectOption(id) {
    let jatekosPenz = parseInt(document.getElementById("jatekos-penz").innerHTML);
    let gepPenz = parseInt(document.getElementById("gep-penz").innerHTML);
    let egyKorAra = 10;
    if(jatekosPenz - egyKorAra < 0)
    {
        eredmenyJelzo.innerHTML = "Nincs elegendő pénzed!";
        return;
    }
    else if(gepPenz - egyKorAra < 0)
    {
        eredmenyJelzo.innerHTML = "Elnyerted a gép összes pénzét!";
        return;
    }
    let koImg = document.getElementById("img-ko");
    let papirImg = document.getElementById("img-papir");
    let olloImg = document.getElementById("img-ollo");
    if(id === 1)
    {
        papirImg.classList.toggle('fade');
        olloImg.classList.toggle('fade');
    }
    else if(id === 2)
    {
        koImg.classList.toggle('fade');
        olloImg.classList.toggle('fade');
    }
    else
    {
        papirImg.classList.toggle('fade');
        koImg.classList.toggle('fade');
    }

    enemysSelection = generateNumber(3);
    let eredmenyJelzo = document.getElementById("utolso-kor");
    let gepValasztasa = document.getElementById("gep-valasztasa");

    // beszurando valasztasa a gepnek 
    // ko
    let beszurKo = document.createElement("img");
    beszurKo.src = 'https://cdn.pixabay.com/photo/2014/12/22/00/03/rock-576669_960_720.png';
    beszurKo.setAttribute("class","img-game");

    // papir
    let beszurPapir = document.createElement("img");
    beszurPapir.src = 'https://image.shutterstock.com/image-photo/white-crumpled-paper-texture-background-600w-482355415.jpg';
    beszurPapir.setAttribute("class","img-game");

    // ollo
    let beszurOllo = document.createElement("img");
    beszurOllo.src = 'https://image.shutterstock.com/image-vector/scrissor-simple-icon-vector-design-600w-1523411963.jpg';
    beszurOllo.setAttribute("class","img-game");

    
    if(id === 1 && enemysSelection === 1)
    {
        gepValasztasa.parentNode.insertBefore(beszurKo,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Döntetlen";
    }
    else if(id === 1 && enemysSelection === 2)
    {
        gepValasztasa.parentNode.insertBefore(beszurPapir,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Gép nyert";
        jatekosPenz -= egyKorAra;
        gepPenz += egyKorAra;
    }
    else if(id === 1 && enemysSelection === 3)
    {
        gepValasztasa.parentNode.insertBefore(beszurOllo,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Te nyertél!";
        jatekosPenz += egyKorAra;
        gepPenz -= egyKorAra;
    }
    else if(id === 2 && enemysSelection === 1)
    {
        gepValasztasa.parentNode.insertBefore(beszurKo,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Te nyertél!";
        jatekosPenz += egyKorAra;
        gepPenz -= egyKorAra;
    }
    else if(id === 2 && enemysSelection === 2)
    {
        gepValasztasa.parentNode.insertBefore(beszurPapir,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Döntetlen!";
    }
    else if(id === 2 && enemysSelection === 3)
    {
        gepValasztasa.parentNode.insertBefore(beszurOllo,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Gép nyert!";
        jatekosPenz -= egyKorAra;
        gepPenz += egyKorAra;
    }
    else if(id === 3 && enemysSelection === 1)
    {
        gepValasztasa.parentNode.insertBefore(beszurKo,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Gép nyert!";
        jatekosPenz -= egyKorAra;
        gepPenz += egyKorAra;
    }
    else if(id === 3 && enemysSelection === 2)
    {
        gepValasztasa.parentNode.insertBefore(beszurPapir,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Te nyertél!";
        jatekosPenz += egyKorAra;
        gepPenz -= egyKorAra;
    }
    else if(id === 3 && enemysSelection === 3)
    {
        gepValasztasa.parentNode.insertBefore(beszurOllo,gepValasztasa.nextSibling); // insert after
        eredmenyJelzo.innerHTML = "Döntetlen!";
    }

    // penz osszegek modositasa
    document.getElementById("jatekos-penz").innerHTML = jatekosPenz;
    document.getElementById("gep-penz").innerHTML = gepPenz;

    


}

// generaljunk 1-3 kozott egy random szamot, gepnek
// 1-ko
// 2-papir
// 3-ollo

function generateNumber(tmp) {
    let rand = Math.random() * tmp;
    return Math.floor(rand);
}

function removeSiblingsAfter(tmp) {
    let i;
    while(i = tmp.nextSibling)
        tmp.parentNode.removeChild(i);
}
function newGame() {
    let koImg = document.getElementById("img-ko");
    let papirImg = document.getElementById("img-papir");
    let olloImg = document.getElementById("img-ollo");
    koImg.classList.toggle('active');
    papirImg.classList.toggle('active');
    olloImg.classList.toggle('active');

    let deleteAfter = document.getElementById("gep-valasztasa");
    removeSiblingsAfter(deleteAfter);

    startGame();

}
