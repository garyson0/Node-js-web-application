
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
        elem.parentNode.insertBefore(hibaEmail,elem.nextSibling);
        
    }
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
        elem.parentNode.insertBefore(hibaWeboldal,elem.nextSibling);
        
    }
}

function addLastModifiedDate() {
    let time = document.lastModified;
    document.getElementsByTagName("footer")[0].innerText = time;
    document.getElementsByTagName("footer")[0].style.textAlign = 'center';
}
