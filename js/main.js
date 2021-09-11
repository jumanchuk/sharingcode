
const userls = localStorage.getItem('user')

let user = JSON.parse(userls);

startArtyom(user.fullname);

function toggleCodeBox() {

    let element = document.getElementById("code-box");
    
    if (element.hidden == true) {

        element.hidden = false;

    } else {
        
        element.value = "";
        element.hidden = true;

    }
}

function send() {

    let text = document.getElementById('crd-text').textContent;
    let code = document.getElementById('code-box').innerText;

    now = new Date() - 1;
    let dataBase = JSON.parse(localStorage.getItem('dataBase'));

    const tweet = new Tweet(dataBase.length + 1, user.fullname, '@' + user.username, text, code, 0, 0, 0,now);
    dataBase.push(tweet);

    try {

        tweet.save(dataBase);
        tweet.print();

    } catch (error) {

        console.error(error);
    }

    clearBoxes();
    let element = document.getElementById("code-box");
    element.hidden = true;
}

function clearBoxes() {

    document.getElementById('crd-text').innerHTML = "";
    document.getElementById('code-box').innerHTML = "";
}

//Object Card
class Tweet {

    constructor(id, name, user, text, code, bookmark, retweet, like, datetime) {

        this.id = id;
        this.name = name;
        this.user = user;
        this.text = text;
        this.code = code;
        this.bookmark = bookmark;
        this.retweet = retweet;
        this.like = like;
        this.datetime = datetime;

    }

    save(dataBase) {

        if (this.text == "") {

            let error = document.getElementById('error');
            error.innerHTML = 'This is awkward 🥴, you have to write something 👀.';
            error.removeAttribute('hidden');

            throw "Error parametros insuficientes";

        } else {

            localStorage.setItem('dataBase',JSON.stringify(dataBase));
            return 'OK'

        }
    }

    print() {

        let error = document.getElementById('error');

        if(error){
            error.innerHTML = "";
            error.hidden = "true";
        }

        document.getElementById('crd-principal').insertAdjacentHTML('afterend',
            '<div class="col-12 card-timeline">' +
            '<div class="container">' +
            '<div class="row">' +
            '<div class="col-2">' +
            '<img src="img/user.png" class="rounded-circle user-img" alt="Cinque Terre">' +
            '</div>' +

            '<div class="col-10">' +
            '<div class="d-flex justify-content-start crd-label userlabel">' +
            '<div class="p-2 user">' + this.name + '</div>' +
            '<div class="p-2 user">' + this.user + '</div>' +
            '<div class="p-2 user">' + formatDate(this.datetime) + '</div>' +
            '</div>' +

            '<div class="crd-label">' + this.text +
            '<div class="codebox" ' + (this.code == "" ? "hidden" : "") + '>' +
            '<pre>' +
            '<code data-language="css">' +
            '<xmp>' + this.code +
            '</xmp>' +
            '</code>' +
            '</pre>' +
            '</div>' +

            '<div class="d-flex justify-content-around card-submenu">' +

            '<a class="p-2 fa-tw-icons rounded-circle" href="#">' +
            '<i class="fa fa-comment-o"> 0' +
            '</i>' +
            '</a>' +

            '<a class="p-2 fa-tw-icons ' + (this.bookmark ? "bookmark" : "") +  ' rounded-circle" href="#" onclick="addToBookmark(this)">' +
            '<i class="fa fa-star">' +
            '</i>' +
            '</a>' +

            '<a class="p-2 fa-tw-icons rounded-circle" href="#" onclick="retweet(this)">' +
            '<i class="fa fa-retweet"> ' + this.retweet +
            '</i>' +
            '</a>' +

            '<a class="p-2 fa-tw-icons rounded-circle" href="#" onclick="like(this)">' +
            '<i class="fa fa-heart"> '+ this.like +
            '</i>' +
            '</a>' +

            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

    }
}
//End Object Card

function like(element) {

    let value = element.children[0].textContent;

    if (!element.classList.contains("like")) {

        let sum = parseInt(value) + parseInt(1);

        if (sum < 1) {
            element.children[0].textContent = ' 0';
        } else {
            element.children[0].textContent = '\u00A0' + sum;
        }

        element.style.setProperty("color", "red", "important");
        element.classList.add("like");
    } else {

        let sum = parseInt(value) - parseInt(1);

        if (sum < 1) {
            element.children[0].textContent = ' 0';
        } else {
            element.children[0].textContent = '\u00A0' + sum;
        }

        element.style.setProperty("color", "white", "important");
        element.classList.remove("like");
    }
}

function retweet(element) {

    let value = element.children[0].textContent;

    if (!element.classList.contains("rtw")) {

        let sum = parseInt(value) + parseInt(1);

        if (sum < 1) {
            element.children[0].textContent = ' 0';
        } else {
            element.children[0].textContent = '\u00A0' + sum;
        }

        element.style.setProperty("color", "green", "important");
        element.classList.add("rtw");
    } else {

        let sum = parseInt(value) - parseInt(1);

        if (sum < 1) {
            element.children[0].textContent = ' 0';
        } else {
            element.children[0].textContent = '\u00A0' + sum;
        }

        element.style.setProperty("color", "white", "important");
        element.classList.remove("rtw");

    }
}

function addToBookmark(element) {

    let value = document.getElementById("fav").children[0].textContent;

    if (!element.classList.contains("bookmark")) {

        element.style.setProperty("color", "rgb(247, 252, 0)", "important");
        element.classList.add("bookmark");

        let sum = parseInt(value) + parseInt(1);

        if (sum < 1) {
            document.getElementById("fav").children[0].textContent = ' 0';
        } else {
            document.getElementById("fav").children[0].textContent = '\u00A0' + sum;
        }

    } else {

        element.style.setProperty("color", "white", "important");
        element.classList.remove("bookmark");

        let sum = parseInt(value) - parseInt(1);

        if (sum < 1) {
            document.getElementById("fav").children[0].textContent = ' 0';
        } else {
            document.getElementById("fav").children[0].textContent = '\u00A0' + sum;
        }

    }
}

function filter(element){

    let hashtagFilter = element.innerText;
    let dataBase = JSON.parse(localStorage.getItem('dataBase'));

    $("div.card-timeline").remove();
    
    const tweets = dataBase.filter(query => query.text.includes(hashtagFilter));

    for(let i = 0; i <tweets.length;i++){

    const tweet = new Tweet(tweets[i].id,tweets[i].name,tweets[i].user,tweets[i].text,tweets[i].code,tweets[i].bookmark,tweets[i].retweet,tweets[i].like,tweets[i].datetime);
    tweet.print();

    }


}

function formatDate(date) {
    //font: https://javascript.info/date

    if ((new Date() - date) / 1000 < 1) {
        return 'right now';
    }
    else if ((new Date() - date) / 1000 > 1 && (new Date() - date) / 1000 < 60) {
        let n = Math.floor((new Date() - date) / 1000);
        return `${n} sec. ago`;

    } else if ((new Date() - date) / 1000 > 60 && (new Date() - date) / 1000 < 3600) {

        let m = Math.floor((new Date() - date) / (1000 * 60));
        return `${m} min. ago`;

    } else if ((new Date() - date) / 1000 > 3600) {

        let newDate = new Date(date);
        let day = newDate.getDate();
        let month = newDate.getMonth();

        if (day < 10) {
            day = `0${day}`
        }

        if (month < 10) {
            month = `0${month}`
        }
        return `${day}:${month}:${newDate.getFullYear()} ${newDate.getDay}`;
    }

}

function startArtyom(name){

    const personalAssistant = new Artyom();
    
    personalAssistant.fatality();// Detener cualquier instancia previa
    
    setTimeout(function(){// Esperar 250ms para inicializar
        personalAssistant.initialize({
            lang:"es-ES",// Más lenguajes son soportados, lee la documentación
            continuous:true,// Artyom obedecera por siempre
            listen:true, // Iniciar !
            debug:true, // Muestra un informe en la consola
            speed: 1 // Habla normalmente
        }).then(function(){
            console.log("Ready to work !");
        });

        personalAssistant.say('Hola '+ name +'. Soy tu asistente virtual. Solo di "Hola" y mi nombre y te ayudare.');
        personalAssistant.say('Soy "María" un placer!');
        console.log(name);

    },1300);


    // Add a single command
    var comandos = {
        indexes:["Hola María"], // Decir alguna de estas palabras activarairel comando
        action:function(){ // Acción a ejecutar cuando alguna palabra de los indices es reconocida

            personalAssistant.say("¿Y ahora que quieres? estoy ocupada.")
            personalAssistant.say("Aun estoy aprendiendo."); 
            personalAssistant.say("Espero pronto poder ayudarte en tus tareas.");
        }
    };

    personalAssistant.addCommands(comandos); // Agregar comando

    }