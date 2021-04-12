var x = 15;

console.log(x);

function gomb_katt(){
    let footerke = document.getElementById("gomb_kattintas");
    footerke.innerText = "Aladár";
    let headings2 = document.getElementsByClassName("parateszt");
    let added = document.getElementById("added")
    if (added){
        for(let i = 0; i < headings2.length; i++){
            headings2[i].style.color = "red";
       }
       document.body.removeChild(added);
    }
    else
    {
        for(let i = 0; i < headings2.length; i++){
            headings2[i].style.color = "aqua";
       }
       // uj elem add: szulo alapjan
        let new_par = document.createElement("p");
        new_par.innerText = "new pppppp";
        //document.body.appendChild(new_par);
        new_par.setAttribute("id","added");
        document.body.insertBefore(new_par,footerke);
    }
   

   

   
}