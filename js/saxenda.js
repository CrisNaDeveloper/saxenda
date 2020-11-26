function parametroURL(_par) {

    var _p = null;
    if (location.search) location.search.substr(1).split("&").forEach(function(pllv) {
        var s = pllv.split("="), //separamos llave/valor
            ll = s[0],
            v = s[1] && decodeURIComponent(s[1]); //valor hacemos encode para prevenir url encode
        if (ll == _par) { //solo nos interesa si es el nombre del parametro a buscar
            if (_p == null) {
                _p = v; //si es nula, quiere decir que no tiene valor, solo textual
            } else if (Array.isArray(_p)) {
                _p.push(v); //si ya es arreglo, agregamos este valor
            } else {
                _p = [_p, v]; //si no es arreglo, lo convertimos y agregamos este valor
            }
        }
    });
    return _p;
}
var config = {
    apiKey: "AIzaSyC7k-ZwvRr4r0SW6x-LzAhGT7XnssZy09A",
    authDomain: "saxenda-6f20a.firebaseapp.com",
    databaseURL: "https://saxenda-6f20a.firebaseio.com",
    projectId: "saxenda-6f20a",
    storageBucket: "saxenda-6f20a.appspot.com",
    messagingSenderId: "628276131253",
    appId: "1:628276131253:web:b7f04165b06765beb655fc",
    measurementId: "G-1S39HNYCYQ"
};



if (!app.apps.length) {
    app.initializeApp(config);
}

var db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
var fechayhora;
var timestamp;
var offset;


var offsetRef = firebase.database().ref(".info/serverTimeOffset");
offsetRef.on("value", damefechayhora, errorfecha);

function damefechayhora(snap) {

    offset = snap.val();
    timestamp = new Date().getTime() + offset;
    //	timestamp=db.Timestamp;


    var d = new Date(timestamp);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    var curr_hour = d.getHours();
    var curr_min = d.getMinutes();
    var curr_sec = d.getSeconds();


    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    fechayhora = day + "/" + month + "/" + year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

    //$("#fecha").append(" " + fechayhora);



}




function formateofecha(fecha) {

    var day = fecha.getDate();
    var month = fecha.getMonth() + 1;
    var year = fecha.getFullYear();

    var curr_hour = fecha.getHours();
    var curr_min = fecha.getMinutes();
    var curr_sec = fecha.getSeconds();


    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return day + "/" + month + "/" + year + " " + curr_hour + ":" + curr_min + ":" + curr_sec;

}

function errorfecha(e) {

    console.log("error" + e);
}










function alta() {

    db.collection("saxenda").add({
            email: email,
            cantidad: cantidad,
            fecha: fechayhora,
            otros: coordenadas,
            ocupacion_actual: ocupacion_actual,

        })
        .then(function(docRef) {


            alertify.success("Se ha añadido correctamente");


        })
        .catch(function(error) {

            console.error("Error adding document: ", error);
        });

}



function borrar(email, dia) {
    var borrar = db.collection('saxenda').where('email', '==', email);
    resul.get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        }).catch(function(error) {
            console.error("Error borrando preguntas: ", error);
        });
}


var datos_consult;




function consulta(email) {

    db.collection("saxenda").where("email", "==", email).get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {


                datos_consult = doc.data();


                $("#fecha").val(datos_consult.fecha);
                $("#cantidad").val(datos_consult.provincia);

            });
        });

}





function actualizar(email, fecha, cantidad) {

    db.collection('saxenda').doc(email).set({

        cantidad: aforo_actual,
    }, { merge: true });
    alertify.success("Dato actualizado");
}



//CARGA DE DATOS DE JSON
/*
const collectionKey = "aforo";
if (data && (typeof data === "object")) {
var coleccion = db.collection(collectionKey);
for(var elemento in data[0]){
coleccion.doc(elemento).set(data[0][elemento]);

}
}
*/