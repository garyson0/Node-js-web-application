// beepitett checkValidity fuggveny burkolo fuggvenye
function validDate() {
    let dateElement = document.getElementById("szuldatum");
    if(document.getElementById("errorMessageDate"))
    {
        document.getElementById("errorMessageDate").remove();
    }
    if(dateElement.checkValidity() === false)
    {
        let buttonElement = document.getElementById("buttON");
        let errorMessageElement = document.createElement("p");
        errorMessageElement.id = "errorMessageDate";
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
    if(document.getElementById("errorMessageFirstName"))
    {
        document.getElementById("errorMessageFirstName").remove();
    }
    if(firtNameElement.checkValidity() === false)
    {
        let errorMessageElement = document.createElement("p");
        errorMessageElement.id = "errorMessageFirstName";
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
    if(document.getElementById("errorMessageLastName"))
    {
        document.getElementById("errorMessageLastName").remove();
    }
    if(lastNameElement.checkValidity() === false)
    {
        let errorMessageElement = document.createElement("p");
        errorMessageElement.id = "errorMessageLastName";
        errorMessageElement.innerText = "Hibas keresztnev!";
        errorMessageElement.style.color = "red";
        lastNameElement.parentNode.insertBefore(errorMessageElement,lastNameElement.nextSibling); // insert after

        return false;

    }
    return true;
}

// email cim ellenorzes
function validEmailAddress(email) {
    const emailPattern = /^[A-Za-z0-9_]+(@yahoo|@gmail)\.(com)$/;
    let elem = document.getElementById(email);
    if(document.getElementById("hibasEmail"))
    {
        document.getElementById("hibasEmail").remove();
    }   
    if (!elem.value.match(emailPattern))
    {
        let hibaEmail = document.createElement("p");
        hibaEmail.id = "hibasEmail"
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
    if(document.getElementById("hibasWeboldal"))
    {
        document.getElementById("hibasWeboldal").remove();
    }   
    if (!elem.value.match(webPagePattern))
    {
        let hibaWeboldal = document.createElement("p");
        hibaWeboldal.id = "hibasWeboldal"
        hibaWeboldal.innerText = "Hibas weboldal!";
        hibaWeboldal.style.color = "red";
        elem.parentNode.insertBefore(hibaWeboldal,elem.nextSibling); //insert after

        return false;
        
    }
    return true;
}

function checkBeforeSubmit() {
    let buttonElement = document.getElementById("buttON");
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
    document.getElementsByTagName("footer")[0].innerText = time;
    document.getElementsByTagName("footer")[0].style.textAlign = 'center';
}


